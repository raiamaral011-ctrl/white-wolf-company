import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import crypto from 'crypto';

export function getMercadoPagoAccessToken(): string {
  return (
    process.env.MERCADO_PAGO_ACCESS_TOKEN ||
    process.env.MERCADOPAGO_ACCESS_TOKEN ||
    ''
  ).trim();
}

export function getMercadoPagoPublicKey(): string {
  return (
    process.env.MERCADO_PAGO_PUBLIC_KEY ||
    process.env.MERCADOPAGO_PUBLIC_KEY ||
    ''
  ).trim();
}

export function getMercadoPagoWebhookSecret(): string {
  return (
    process.env.MERCADO_PAGO_WEBHOOK_SECRET ||
    process.env.MERCADOPAGO_WEBHOOK_SECRET ||
    ''
  ).trim();
}

export function getMercadoPagoConfig(): MercadoPagoConfig | null {
  const token = getMercadoPagoAccessToken();
  if (!token) return null;
  return new MercadoPagoConfig({ accessToken: token });
}

export interface CreatePreferenceItem {
  id: string;
  title: string;
  description?: string;
  picture_url?: string;
  quantity: number;
  unit_price: number;
}

export interface CreatePreferenceInput {
  orderId: string;
  items: CreatePreferenceItem[];
  shippingCost: number;
  payer: {
    email: string;
    first_name: string;
    last_name?: string;
    identification?: {
      type: string;
      number: string;
    };
    phone?: {
      area_code?: string;
      number?: string;
    };
    address?: {
      zip_code?: string;
      street_name?: string;
      street_number?: number;
    };
  };
}

export interface CreatePreferenceResult {
  success: boolean;
  preferenceId?: string;
  checkoutUrl?: string;
  sandboxCheckoutUrl?: string;
  initPoint?: string;
  error?: string;
  requiresConfiguration?: boolean;
}

/**
 * Creates a Mercado Pago Checkout Pro Preference on the server.
 * Ensures server-side validated items, prices and metadata.
 */
export async function createMercadoPagoPreference(
  input: CreatePreferenceInput
): Promise<CreatePreferenceResult> {
  const accessToken = getMercadoPagoAccessToken();
  const mpConfig = getMercadoPagoConfig();

  if (!accessToken || !mpConfig) {
    return {
      success: false,
      requiresConfiguration: true,
      error:
        'MERCADO_PAGO_ACCESS_TOKEN não está configurado no ambiente. Configure a variável MERCADO_PAGO_ACCESS_TOKEN na Vercel ou no arquivo .env.local para processar pagamentos reais com o Mercado Pago.',
    };
  }

  // Get app base URL for return and webhook URLs
  const appUrl = (
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  ).replace(/\/$/, '');

  try {
    const preferenceClient = new Preference(mpConfig);

    // Format items for Mercado Pago Preference
    const mpItems = input.items.map((it) => ({
      id: it.id,
      title: it.title,
      description: it.description || it.title,
      picture_url: it.picture_url,
      quantity: it.quantity,
      unit_price: Number(it.unit_price.toFixed(2)),
      currency_id: 'BRL',
    }));

    // If shipping is positive, add shipping as an item or through shipments configuration
    const preferenceBody: any = {
      items: mpItems,
      payer: {
        email: input.payer.email,
        name: input.payer.first_name,
        surname: input.payer.last_name || '',
        identification: input.payer.identification,
        phone: input.payer.phone,
        address: input.payer.address,
      },
      external_reference: input.orderId,
      statement_descriptor: 'WHITE WOLF',
      back_urls: {
        success: `${appUrl}/checkout/feedback?order_id=${input.orderId}&status=success`,
        pending: `${appUrl}/checkout/feedback?order_id=${input.orderId}&status=pending`,
        failure: `${appUrl}/checkout/feedback?order_id=${input.orderId}&status=failure`,
      },
      auto_return: 'approved',
      notification_url: `${appUrl}/api/webhooks/mercadopago`,
      payment_methods: {
        installments: 10,
      },
      metadata: {
        order_id: input.orderId,
        source: 'white-wolf-company',
      },
    };

    if (input.shippingCost > 0) {
      preferenceBody.shipments = {
        cost: Number(input.shippingCost.toFixed(2)),
        mode: 'not_specified',
      };
    }

    const response = await preferenceClient.create({
      body: preferenceBody,
    });

    const isTestToken = accessToken.startsWith('TEST-');
    const chosenUrl = isTestToken
      ? (response.sandbox_init_point || response.init_point)
      : (response.init_point || response.sandbox_init_point);

    return {
      success: true,
      preferenceId: response.id,
      initPoint: response.init_point,
      sandboxCheckoutUrl: response.sandbox_init_point,
      checkoutUrl: chosenUrl,
    };
  } catch (error: any) {
    console.error('[MercadoPago Preference Error]:', error);
    return {
      success: false,
      error: error?.message || 'Erro ao gerar preferência de pagamento no Mercado Pago.',
    };
  }
}

/**
 * Consults real payment details directly from Mercado Pago API.
 */
export async function getMercadoPagoPaymentDetails(paymentId: string | number) {
  const mpConfig = getMercadoPagoConfig();
  if (!mpConfig) {
    throw new Error('MERCADO_PAGO_ACCESS_TOKEN não configurado.');
  }

  const paymentClient = new Payment(mpConfig);
  const payment = await paymentClient.get({ id: String(paymentId) });
  return payment;
}

/**
 * Validates Mercado Pago webhook notification signature using HMAC SHA-256.
 * Ref: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
 */
export function verifyMercadoPagoSignature({
  xSignature,
  xRequestId,
  dataId,
}: {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string;
}): { valid: boolean; reason?: string } {
  const secret = getMercadoPagoWebhookSecret();

  // If no secret configured yet, warn but do not break initial setup
  if (!secret) {
    return {
      valid: true,
      reason: 'MERCADO_PAGO_WEBHOOK_SECRET não configurado - validação de assinatura em modo permissivo.',
    };
  }

  if (!xSignature) {
    return { valid: false, reason: 'Cabeçalho x-signature ausente na requisição.' };
  }

  // Parse ts and v1 from x-signature (e.g. "ts=1700000000,v1=9b...c3")
  const parts = xSignature.split(',').reduce((acc: Record<string, string>, item) => {
    const [k, v] = item.trim().split('=');
    if (k && v) acc[k] = v;
    return acc;
  }, {});

  const ts = parts['ts'];
  const v1 = parts['v1'];

  if (!ts || !v1) {
    return { valid: false, reason: 'Formato inválido do cabeçalho x-signature (esperado ts=...,v1=...).' };
  }

  // Build manifest template: id:[data.id];request-id:[x-request-id];ts:[ts];
  const manifest = `id:${dataId};request-id:${xRequestId || ''};ts:${ts};`;

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(manifest);
  const computedHash = hmac.digest('hex');

  const isValid = crypto.timingSafeEqual(
    Buffer.from(computedHash, 'utf8'),
    Buffer.from(v1, 'utf8')
  );

  return {
    valid: isValid,
    reason: isValid ? undefined : 'Assinatura HMAC SHA256 não confere com a chave secreta configurada.',
  };
}
