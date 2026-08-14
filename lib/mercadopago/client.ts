import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || '';

export const mpConfig = accessToken
  ? new MercadoPagoConfig({ accessToken })
  : null;

export interface CreatePaymentInput {
  orderId: string;
  total: number;
  paymentMethod: 'pix' | 'credit_card';
  payer: {
    email: string;
    first_name: string;
    last_name?: string;
    identification?: {
      type: string;
      number: string;
    };
  };
  cardToken?: string;
  installments?: number;
}

export async function processMercadoPagoPayment(input: CreatePaymentInput) {
  if (!mpConfig || !accessToken.startsWith('TEST') && !accessToken.startsWith('APP_USR')) {
    // Development sandbox simulation mode when credentials are dummy
    const isPix = input.paymentMethod === 'pix';
    return {
      success: true,
      paymentId: `MP-SIM-${Date.now()}`,
      status: 'approved',
      qrCode: isPix ? '00020126580014BR.GOV.BCB.PIX0136WHITEWOLFCO-PIX-PAYMENT-CODE-EXAMPLE520400005303986540510.005802BR5917WHITE WOLF COMPANY6009SAO PAULO62070503***6304E2CA' : undefined,
      qrCodeBase64: isPix ? 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' : undefined,
      isSimulated: true,
    };
  }

  try {
    const paymentClient = new Payment(mpConfig);

    if (input.paymentMethod === 'pix') {
      const response = await paymentClient.create({
        body: {
          transaction_amount: input.total,
          description: `Pedido White Wolf Co #${input.orderId.substring(0, 8)}`,
          payment_method_id: 'pix',
          payer: {
            email: input.payer.email,
            first_name: input.payer.first_name,
            identification: input.payer.identification,
          },
        },
      });

      return {
        success: true,
        paymentId: response.id?.toString() || '',
        status: response.status || 'pending',
        qrCode: response.point_of_interaction?.transaction_data?.qr_code,
        qrCodeBase64: response.point_of_interaction?.transaction_data?.qr_code_base64,
      };
    } else {
      const response = await paymentClient.create({
        body: {
          transaction_amount: input.total,
          token: input.cardToken,
          description: `Pedido White Wolf Co #${input.orderId.substring(0, 8)}`,
          installments: input.installments || 1,
          payer: {
            email: input.payer.email,
            first_name: input.payer.first_name,
            identification: input.payer.identification,
          },
        },
      });

      return {
        success: true,
        paymentId: response.id?.toString() || '',
        status: response.status || 'approved',
      };
    }
  } catch (error) {
    console.error('Mercado Pago Payment Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao processar pagamento com Mercado Pago',
    };
  }
}
