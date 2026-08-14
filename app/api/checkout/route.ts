import { NextResponse } from 'next/server';
import { checkoutSchema } from '@/lib/validation/schemas';
import { MOCK_PRODUCTS } from '@/lib/data/products';
import { processMercadoPagoPayment } from '@/lib/mercadopago/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = checkoutSchema.parse(body.checkoutData);
    const cartItems = body.items || [];

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'O carrinho está vazio.' }, { status: 400 });
    }

    // SERVER-SIDE PRICE VALIDATION (Rule 24: Never trust client prices!)
    let serverSubtotal = 0;
    const validatedOrderItems = [];

    for (const item of cartItems) {
      const dbProduct = MOCK_PRODUCTS.find((p) => p.id === item.product?.id || p.id === item.productId);
      if (!dbProduct) {
        return NextResponse.json({ error: `Produto ${item.product?.name || item.productId} não encontrado.` }, { status: 400 });
      }

      // Re-fetch price from authoritative server database
      const realUnitPrice = dbProduct.price;
      const itemSubtotal = realUnitPrice * item.quantity;
      serverSubtotal += itemSubtotal;

      validatedOrderItems.push({
        product_id: dbProduct.id,
        variant_id: item.variant?.id || `${dbProduct.id}-v1`,
        product_name: dbProduct.name,
        product_sku: dbProduct.sku,
        size: item.variant?.size || '40',
        color: item.variant?.color_name || 'Padrão',
        quantity: item.quantity,
        unit_price: realUnitPrice,
        subtotal: itemSubtotal,
      });
    }

    // Calculate shipping on server
    const serverShipping = validatedData.shippingMethod === 'express' ? 34.9 : (serverSubtotal >= 299 ? 0 : 19.9);
    // Discount for PIX (5%)
    const serverDiscount = validatedData.paymentMethod === 'pix' ? serverSubtotal * 0.05 : 0;
    const serverTotal = serverSubtotal + serverShipping - serverDiscount;

    // Create unique order ID
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Process payment with Mercado Pago server client
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
      return NextResponse.json({ error: paymentResult.error || 'Falha no pagamento' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      order: {
        id: orderId,
        status: paymentResult.status === 'approved' ? 'approved' : 'pending',
        paymentStatus: paymentResult.status || 'pending',
        paymentMethod: validatedData.paymentMethod,
        subtotal: serverSubtotal,
        discount: serverDiscount,
        shipping: serverShipping,
        total: serverTotal,
        shippingAddress: {
          street: validatedData.street,
          number: validatedData.number,
          complement: validatedData.complement,
          neighborhood: validatedData.neighborhood,
          city: validatedData.city,
          state: validatedData.state,
          cep: validatedData.cep,
        },
        customerInfo: {
          fullName: validatedData.fullName,
          email: validatedData.email,
          cpf: validatedData.cpf,
          phone: validatedData.phone,
        },
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
