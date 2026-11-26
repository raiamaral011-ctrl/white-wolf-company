import { NextResponse } from 'next/server';
import {
  getMercadoPagoPaymentDetails,
  verifyMercadoPagoSignature,
  getMercadoPagoAccessToken,
} from '@/lib/mercadopago/client';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Responds to Mercado Pago webhook health-checks / verification
  return NextResponse.json({
    status: 'online',
    endpoint: '/api/webhooks/mercadopago',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const body = await request.json().catch(() => ({}));

    const xSignature = request.headers.get('x-signature');
    const xRequestId = request.headers.get('x-request-id');

    // Extract payment ID from body or query parameters
    const paymentId =
      url.searchParams.get('data.id') ||
      url.searchParams.get('id') ||
      body.data?.id ||
      body.id;

    const topic = url.searchParams.get('topic') || url.searchParams.get('type') || body.type || body.action;

    // If it's not a payment notification or has no paymentId, acknowledge and exit
    if (!paymentId) {
      return NextResponse.json(
        { message: 'Notificação recebida sem ID de pagamento. Ignorado com sucesso.' },
        { status: 200 }
      );
    }

    // 1. Authenticity and Signature Verification
    const sigCheck = verifyMercadoPagoSignature({
      xSignature,
      xRequestId,
      dataId: String(paymentId),
    });

    if (!sigCheck.valid) {
      console.warn('[MercadoPago Webhook] Assinatura inválida:', sigCheck.reason);
      return NextResponse.json(
        { error: 'Assinatura inválida', reason: sigCheck.reason },
        { status: 401 }
      );
    }

    // 2. Fetch real transaction state directly from official Mercado Pago API
    const accessToken = getMercadoPagoAccessToken();
    if (!accessToken) {
      console.warn('[MercadoPago Webhook] MERCADO_PAGO_ACCESS_TOKEN não configurado.');
      return NextResponse.json(
        { error: 'MERCADO_PAGO_ACCESS_TOKEN não configurado.' },
        { status: 503 }
      );
    }

    let paymentData: any = null;
    try {
      paymentData = await getMercadoPagoPaymentDetails(paymentId);
    } catch (mpErr: any) {
      console.error(`[MercadoPago Webhook] Erro ao consultar pagamento #${paymentId}:`, mpErr.message);
      return NextResponse.json(
        { error: 'Falha ao consultar transação no Mercado Pago: ' + mpErr.message },
        { status: 500 }
      );
    }

    if (!paymentData) {
      return NextResponse.json({ error: 'Pagamento não encontrado na API do Mercado Pago.' }, { status: 404 });
    }

    const externalReference = paymentData.external_reference;
    const mpStatus = paymentData.status; // approved, pending, in_process, rejected, cancelled, refunded
    const transactionAmount = paymentData.transaction_amount;

    if (!externalReference) {
      console.log(`[MercadoPago Webhook] Pagamento #${paymentId} sem external_reference.`);
      return NextResponse.json({ received: true, note: 'No external_reference' }, { status: 200 });
    }

    // 3. Find corresponding order in Supabase
    const supabase = createAdminClient();
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('id', externalReference)
      .single();

    if (orderErr || !order) {
      console.warn(`[MercadoPago Webhook] Pedido #${externalReference} não encontrado no banco.`);
      return NextResponse.json({ error: 'Pedido correspondente não localizado.' }, { status: 404 });
    }

    // 4. Value Check (conferir valores)
    if (Math.abs(Number(order.total) - Number(transactionAmount)) > 0.5) {
      console.warn(
        `[MercadoPago Webhook] Divergência de valores para pedido #${order.id}. Esperado: ${order.total}, Recebido: ${transactionAmount}`
      );
    }

    // 5. Idempotency Check: Avoid processing same confirmation multiple times
    const isAlreadyApproved = order.payment_status === 'approved';
    const isNowApproved = mpStatus === 'approved';

    let mappedOrderStatus = order.status;
    let mappedPaymentStatus = order.payment_status;

    switch (mpStatus) {
      case 'approved':
        mappedOrderStatus = 'approved';
        mappedPaymentStatus = 'approved';
        break;
      case 'in_process':
      case 'pending':
      case 'authorized':
        mappedOrderStatus = 'pending';
        mappedPaymentStatus = 'pending';
        break;
      case 'rejected':
        mappedOrderStatus = 'cancelled';
        mappedPaymentStatus = 'rejected';
        break;
      case 'cancelled':
        mappedOrderStatus = 'cancelled';
        mappedPaymentStatus = 'cancelled';
        break;
      case 'refunded':
      case 'charged_back':
        mappedOrderStatus = 'cancelled';
        mappedPaymentStatus = 'refunded';
        break;
      default:
        mappedPaymentStatus = mpStatus;
        break;
    }

    // 6. Secure Stock Decrement (Executed ONLY when transitioning to approved for the first time)
    if (isNowApproved && !isAlreadyApproved) {
      console.log(`[MercadoPago Webhook] Confirmando pagamento do pedido #${order.id}. Baixando estoque com segurança.`);

      if (order.items && order.items.length > 0) {
        for (const item of order.items) {
          if (item.variant_id) {
            // Fetch current variant stock
            const { data: variant } = await supabase
              .from('product_variants')
              .select('id, stock')
              .eq('id', item.variant_id)
              .single();

            if (variant) {
              const updatedStock = Math.max(0, (variant.stock || 0) - item.quantity);
              await supabase
                .from('product_variants')
                .update({ stock: updatedStock, updated_at: new Date().toISOString() })
                .eq('id', variant.id);
            }
          }
        }
      }
    }

    // 7. Update Order in Supabase
    await supabase
      .from('orders')
      .update({
        status: mappedOrderStatus,
        payment_status: mappedPaymentStatus,
        payment_id: String(paymentId),
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id);

    // 8. Update Payments Table in Supabase
    await supabase
      .from('payments')
      .update({
        status: mappedPaymentStatus,
        provider_payment_id: String(paymentId),
        updated_at: new Date().toISOString(),
      })
      .eq('order_id', order.id);

    console.log(
      `[MercadoPago Webhook] Pedido #${order.id} atualizado: Status=${mappedOrderStatus}, Pagamento=${mappedPaymentStatus}`
    );

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        paymentId,
        paymentStatus: mappedPaymentStatus,
        idempotent: isAlreadyApproved && isNowApproved,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[MercadoPago Webhook Fatal Error]:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar notificação do Mercado Pago: ' + error.message },
      { status: 500 }
    );
  }
}
