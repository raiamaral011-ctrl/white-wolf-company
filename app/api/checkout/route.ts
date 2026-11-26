import { NextResponse } from 'next/server';
import { checkoutSchema } from '@/lib/validation/schemas';
import { createMercadoPagoPreference, getMercadoPagoAccessToken } from '@/lib/mercadopago/client';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { MOCK_PRODUCTS } from '@/lib/data/products';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = checkoutSchema.parse(body.checkoutData);
    const cartItems = body.items || [];

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'O carrinho está vazio.' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Try to get authenticated user if present
    let authUserId: string | null = null;
    try {
      const serverClient = createClient();
      const { data: { user } } = await serverClient.auth.getUser();
      if (user) {
        authUserId = user.id;
      }
    } catch {
      // Guest session fallback
    }

    // Fallback: If not found in cookie session, check client passed userId or profile email
    if (!authUserId && (body.userId || body.checkoutData?.userId)) {
      const candidateId = body.userId || body.checkoutData?.userId;
      const { data: profileCheck } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('user_id', candidateId)
        .single();
      if (profileCheck?.user_id) {
        authUserId = profileCheck.user_id;
      }
    }

    if (!authUserId && validatedData.email) {
      const { data: profileByEmail } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', validatedData.email.trim().toLowerCase())
        .single();
      if (profileByEmail?.user_id) {
        authUserId = profileByEmail.user_id;
      }
    }

    // 2. SERVER-SIDE PRICE & STOCK VALIDATION (Never trust client prices)
    let serverSubtotal = 0;
    const validatedOrderItems = [];
    const preferenceItems = [];

    for (const item of cartItems) {
      const pId = item.product?.id || item.productId;
      const vId = item.variant?.id || item.variantId;
      const requestedSize = String(item.variant?.size || item.size || '40');

      let dbProduct: any = null;
      let dbVariant: any = null;

      // Query Supabase for real product & variants
      if (pId) {
        const { data: prodData } = await supabase
          .from('products')
          .select('*, variants:product_variants(*), brand:brands(name)')
          .eq('id', pId)
          .single();

        if (prodData) {
          dbProduct = prodData;
          if (vId) {
            dbVariant = prodData.variants?.find((v: any) => v.id === vId);
          }
          if (!dbVariant) {
            dbVariant = prodData.variants?.find((v: any) => String(v.size) === requestedSize);
          }
          if (!dbVariant && prodData.variants?.length > 0) {
            dbVariant = prodData.variants[0];
          }
        }
      }

      // Fallback to MOCK_PRODUCTS if database did not have product
      if (!dbProduct) {
        dbProduct = MOCK_PRODUCTS.find((p) => p.id === pId);
        if (dbProduct && dbProduct.variants) {
          dbVariant = dbProduct.variants.find((v: any) => String(v.size) === requestedSize) || dbProduct.variants[0];
        }
      }

      if (!dbProduct) {
        return NextResponse.json(
          { error: `Produto ${item.product?.name || pId} não foi encontrado no sistema.` },
          { status: 400 }
        );
      }

      // Stock check: Validate stock before accepting order
      const availableStock = dbVariant ? (dbVariant.stock ?? 0) : 0;
      if (availableStock < item.quantity) {
        return NextResponse.json(
          {
            error: `Estoque insuficiente para "${dbProduct.name}" (Tamanho: ${requestedSize}). Estoque disponível: ${availableStock} unidades.`,
          },
          { status: 400 }
        );
      }

      const realUnitPrice = Number(dbProduct.price);
      const itemSubtotal = realUnitPrice * item.quantity;
      serverSubtotal += itemSubtotal;

      const variantIdToUse = dbVariant?.id || vId || `var-${Date.now()}`;
      const itemSize = dbVariant?.size ? String(dbVariant.size) : requestedSize;

      validatedOrderItems.push({
        product_id: dbProduct.id,
        variant_id: variantIdToUse,
        product_name: dbProduct.name,
        product_sku: dbVariant?.sku || dbProduct.sku,
        size: itemSize,
        color: item.variant?.color_name || dbVariant?.color_name || 'Padrão',
        quantity: item.quantity,
        unit_price: realUnitPrice,
        subtotal: itemSubtotal,
      });

      preferenceItems.push({
        id: dbProduct.id,
        title: `${dbProduct.name} - Tam ${itemSize}`,
        description: `Tênis ${dbProduct.name} (Tamanho: ${itemSize})`,
        quantity: item.quantity,
        unit_price: realUnitPrice,
        picture_url: dbProduct.images?.[0]?.url || item.product?.images?.[0]?.url,
      });
    }

    // Shipping calculation on server
    const serverShipping =
      validatedData.shippingMethod === 'express' ? 34.9 : serverSubtotal >= 299 ? 0 : 19.9;
    const serverDiscount = 0; // Checkout Pro calculates payment method discounts directly in MP
    const serverTotal = serverSubtotal + serverShipping - serverDiscount;

    // Generate unique order ID
    const orderId = `WW-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const shippingAddressJson = {
      street: validatedData.street,
      number: validatedData.number,
      complement: validatedData.complement || '',
      neighborhood: validatedData.neighborhood,
      city: validatedData.city,
      state: validatedData.state,
      cep: validatedData.cep,
    };

    const customerInfoJson = {
      full_name: validatedData.fullName,
      email: validatedData.email,
      cpf: validatedData.cpf,
      phone: validatedData.phone,
    };

    // 3. Create Mercado Pago Preference
    const cleanCpf = validatedData.cpf.replace(/\D/g, '');
    const cleanPhone = (validatedData.phone || '').replace(/\D/g, '');
    const phoneArea = cleanPhone.length >= 10 ? cleanPhone.slice(0, 2) : '11';
    const phoneNumber = cleanPhone.length >= 10 ? cleanPhone.slice(2) : cleanPhone;

    const mpResult = await createMercadoPagoPreference({
      orderId,
      items: preferenceItems,
      shippingCost: serverShipping,
      payer: {
        email: validatedData.email,
        first_name: validatedData.fullName.split(' ')[0],
        last_name: validatedData.fullName.split(' ').slice(1).join(' ') || 'Cliente',
        identification: {
          type: 'CPF',
          number: cleanCpf,
        },
        phone: {
          area_code: phoneArea,
          number: phoneNumber,
        },
        address: {
          zip_code: validatedData.cep.replace(/\D/g, ''),
          street_name: validatedData.street,
          street_number: parseInt(validatedData.number, 10) || 1,
        },
      },
    });

    if (!mpResult.success && mpResult.requiresConfiguration) {
      return NextResponse.json(
        {
          error: mpResult.error,
          requiresConfiguration: true,
          variableName: 'MERCADO_PAGO_ACCESS_TOKEN',
        },
        { status: 503 }
      );
    }

    if (!mpResult.success || !mpResult.checkoutUrl) {
      return NextResponse.json(
        { error: mpResult.error || 'Falha ao gerar checkout no Mercado Pago.' },
        { status: 500 }
      );
    }

    // 4. Save pending order in Supabase
    const { data: dbOrder, error: orderErr } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        user_id: authUserId,
        status: 'pending',
        payment_status: 'pending',
        payment_provider: 'mercadopago',
        payment_id: mpResult.preferenceId || orderId,
        subtotal: serverSubtotal,
        discount: serverDiscount,
        shipping: serverShipping,
        total: serverTotal,
        shipping_address: shippingAddressJson,
        customer_info: customerInfoJson,
      })
      .select()
      .single();

    if (orderErr) {
      console.error('Error inserting order in Supabase:', orderErr);
      return NextResponse.json(
        { error: 'Erro ao registrar pedido no banco de dados: ' + orderErr.message },
        { status: 500 }
      );
    }

    // 5. Save order items
    const orderItemsRows = validatedOrderItems.map((item) => ({
      order_id: orderId,
      product_id: item.product_id,
      variant_id: item.variant_id,
      product_name: item.product_name,
      product_sku: item.product_sku,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.subtotal,
    }));

    await supabase.from('order_items').insert(orderItemsRows);

    // 6. Save payment reference
    await supabase.from('payments').insert({
      order_id: orderId,
      provider: 'mercadopago',
      provider_payment_id: mpResult.preferenceId || orderId,
      status: 'pending',
      amount: serverTotal,
      currency: 'BRL',
      payment_method: 'mercadopago_checkout_pro',
    });

    return NextResponse.json({
      success: true,
      orderId,
      preferenceId: mpResult.preferenceId,
      checkoutUrl: mpResult.checkoutUrl,
      sandboxCheckoutUrl: mpResult.sandboxCheckoutUrl,
      order: {
        id: orderId,
        status: 'pending',
        paymentStatus: 'pending',
        total: serverTotal,
        items: validatedOrderItems,
      },
    });
  } catch (error: any) {
    console.error('Checkout API Error:', error);
    return NextResponse.json(
      { error: error?.errors?.[0]?.message || error.message || 'Erro ao processar pedido.' },
      { status: 500 }
    );
  }
}
