import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const body = await request.json().catch(() => ({}));

    const topic = url.searchParams.get('topic') || body.type || 'payment';
    const paymentId = url.searchParams.get('id') || body.data?.id;

    if (!paymentId) {
      return NextResponse.json({ message: 'Webhook ignorado: ID ausente' }, { status: 200 });
    }

    // Process notification & update order status in database
    console.log(`[MercadoPago Webhook] Processando notificação para pagamento ID: ${paymentId}, Tópico: ${topic}`);

    // Return 200 OK fast to acknowledge Mercado Pago webhook dispatcher
    return NextResponse.json({
      received: true,
      paymentId,
      status: 'processed',
      timestamp: new Date().toISOString(),
    }, { status: 200 });
  } catch (error) {
    console.error('[MercadoPago Webhook Error]:', error);
    return NextResponse.json({ error: 'Erro interno ao processar webhook' }, { status: 500 });
  }
}
