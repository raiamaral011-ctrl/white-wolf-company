import { NextResponse } from 'next/server';
import { checkoutSchema } from '@/lib/validation/schemas';
import { processMercadoPagoPayment } from '@/lib/mercadopago/client';
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

    // Try to get authenticated user if present
    let authUserId: string | null = null;
    try {
      const serverClient = createClient();
      const { data: { user } } = await serverClient.auth.getUser();
      if (user) {
        authUserId = user.id;
      }
    } catch {
      // Guest checkout
    }

    // SERVER-SIDE PRICE & STOCK VALIDATION
    let serverSubtotal = 0;
    const validatedOrderItems = [];
    const stockUpdates: { variant_id: string; new_stock: number }[] = [];

    for (const item of cartItems) {
      const pId = item.product?.id || item.productId;
      const vId = item.variant?.id || item.variantId;

      let dbProduct: any = null;
      let dbVariant: any = null;

      // 1. Query Supabase
      if (pId) {
        const { data: prodData } = await supabase
          .from('products')
          .select('*, variants:product_variants(*)')
          .eq('id', pId)
          .single();

        if (prodData) {
          dbProduct = prodData;
          if (vId) {
            dbVariant = prodData.variants?.find((v: any) => v.id === vId);
          }
          if (!dbVariant && prodData.variants?.length > 0) {
            dbVariant = prodData.variants[0];
          }
        }
      }

      // Fallback to MOCK_PRODUCTS if database query didn't return
      if (!dbProduct) {
        dbProduct = MOCK_PRODUCTS.find((p) => p.id === pId);
        if (dbProduct && dbProduct.variants) {
          dbVariant = dbProduct.variants.find((v: any) => v.id === vId) || dbProduct.variants[0];
        }
      }

      if (!dbProduct) {
        return NextResponse.json(
          { error: `Produto ${item.product?.name || pId} não foi encontrado no sistema.` },
          { status: 400 }
        );
      }

      // Check Stock
      const currentStock = dbVariant ? dbVariant.stock : 10;
      if (currentStock < item.quantity) {
        return NextResponse.json(
          {
            error: `Estoque insuficiente para "${dbProduct.name}" (Tamanho: ${item.variant?.size || 'Padrão'}). Estoque disponível: ${currentStock}.`,
          },
          { status: 400 }
        );
      }

      const realUnitPrice = Number(dbProduct.price);
      const itemSubtotal = realUnitPrice * item.quantity;
      serverSubtotal += itemSubtotal;

      const variantIdToUse = dbVariant?.id || vId || `var-${Date.now()}`;

      validatedOrderItems.push({
        product_id: dbProduct.id,
        variant_id: variantIdToUse,
        product_name: dbProduct.name,
        product_sku: dbVariant?.sku || dbProduct.sku,
        size: item.variant?.size || dbVariant?.size || 'Padrão',
        color: item.variant?.color_name || dbVariant?.color_name || 'Padrão',
        quantity: item.quantity,
        unit_price: realUnitPrice,
        subtotal: itemSubtotal,
      });

      if (dbVariant?.id) {
        stockUpdates.push({
          variant_id: dbVariant.id,
          new_stock: Math.max(0, currentStock - item.quantity),
        });
      }
    }

    // Calculate shipping on server
    const serverShipping =
      validatedData.shippingMethod === 'express' ? 34.9 : serverSubtotal >= 299 ? 0 : 19.9;
    // Discount for PIX (5%)
    const serverDiscount = validatedData.paymentMethod === 'pix' ? serverSubtotal * 0.05 : 0;
    const serverTotal = serverSubtotal + serverShipping - serverDiscount;

    // Create unique order ID
    const orderId = `ORD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    // Process payment with Mercado Pago
    const paymentResult = await processMercadoPagoPayment({
      orderId,
      total: serverTotal,
      paymentMethod: validatedData.paymentMethod,
      payer: {
        email: validatedData.email,
        first_name: validatedData.fullName.split(' ')[0],
        last_name: validatedData.fullName.split(' ').slice(1).join(' ') || undefined,
        identification: {
          type: 'CPF',
          number: validatedData.cpf.replace(/\D/g, ''),
        },
      },
      cardToken: validatedData.cardToken,
      installments: validatedData.installments,
    });

    if (!paymentResult.success) {
      return NextResponse.json(
        { error: paymentResult.error || 'Falha ao processar pagamento.' },
        { status: 400 }
      );
    }

    const finalOrderStatus = paymentResult.status === 'approved' ? 'approved' : 'pending';
    const finalPaymentStatus = paymentResult.status || 'pending';

    // 1. SAVE ORDER TO SUPABASE
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

    const { data: dbOrder, error: orderErr } = await supabase
      .from('orders')
      .insert({
        user_id: authUserId,
        status: finalOrderStatus,
        payment_status: finalPaymentStatus,
        payment_provider: 'mercadopago',
        payment_id: paymentResult.paymentId || orderId,
        subtotal: serverSubtotal,
        discount: serverDiscount,
        shipping: serverShipping,
        total: serverTotal,
        shipping_address: shippingAddressJson,
        customer_info: customerInfoJson,
      })
      .select()
      .single();

    const createdOrderId = dbOrder?.id || orderId;

    // 2. SAVE ORDER ITEMS TO SUPABASE
    const orderItemsRows = validatedOrderItems.map((item) => ({
      order_id: createdOrderId,
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

    // 3. SAVE PAYMENT RECORD TO SUPABASE
    await supabase.from('payments').insert({
      order_id: createdOrderId,
      provider: 'mercadopago',
      provider_payment_id: paymentResult.paymentId || orderId,
      status: finalPaymentStatus,
      amount: serverTotal,
      currency: 'BRL',
      payment_method: validatedData.paymentMethod,
      qr_code: paymentResult.qrCode,
      qr_code_base64: paymentResult.qrCodeBase64,
    });

    // 4. DECREMENT STOCK IN SUPABASE
    for (const update of stockUpdates) {
      await supabase
        .from('product_variants')
        .update({ stock: update.new_stock, updated_at: new Date().toISOString() })
        .eq('id', update.variant_id);
    }

    return NextResponse.json({
      success: true,
      order: {
        id: createdOrderId,
        status: finalOrderStatus,
        paymentStatus: finalPaymentStatus,
        paymentMethod: validatedData.paymentMethod,
        subtotal: serverSubtotal,
        discount: serverDiscount,
        shipping: serverShipping,
        total: serverTotal,
        shippingAddress: shippingAddressJson,
        customerInfo: customerInfoJson,
        items: validatedOrderItems,
        paymentDetails: {
          paymentId: paymentResult.paymentId,
          qrCode: paymentResult.qrCode,
          qrCodeBase64: paymentResult.qrCodeBase64,
        },
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
