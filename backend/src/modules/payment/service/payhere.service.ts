import crypto from 'crypto';
import env from '../../../config/env.js';
import ApiError from '../../../core/apiError.js';

export const generatePayHereHash = (
  orderId: string,
  amount: number,
  currency: string = 'LKR'
) => {
  const merchantId = env.PAYHERE_MERCHANT_ID;
  const merchantSecret = env.PAYHERE_SECRET;

  if (!merchantId || !merchantSecret) {
    throw new ApiError(500, 'PayHere credentials not configured');
  }

  const hashedSecret = crypto
    .createHash('md5')
    .update(merchantSecret)
    .digest('hex')
    .toUpperCase();

  const amountFormatted = parseFloat(amount.toString()).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false,
  });

  const hashString = `${merchantId}${orderId}${amountFormatted}${currency}${hashedSecret}`;

  return crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();
};

export const getPayHereOAuthToken = async () => {
  const { PAYHERE_APP_ID, PAYHERE_APP_SECRET } = env;

  if (!PAYHERE_APP_ID || !PAYHERE_APP_SECRET) {
    throw new ApiError(500, 'PayHere App credentials not configured');
  }

  const auth = Buffer.from(`${PAYHERE_APP_ID}:${PAYHERE_APP_SECRET}`).toString('base64');

  try {
    const response = await fetch(
      `${env.PAYHERE_BASE_URL}/merchant/v1/oauth/token`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        502,
        data.error_description || response.statusText || 'PayHere OAuth failed'
      );
    }

    return data.access_token;
  } catch (error: any) {
    throw new ApiError(502, error.message || 'PayHere OAuth Error');
  }
};

export const chargeSavedCard = async (
  customerToken: string,
  amount: number,
  orderId: string,
  items: string = 'Laundry Payment'
) => {
  try {
    const token = await getPayHereOAuthToken();

    const response = await fetch(
      `${env.PAYHERE_BASE_URL}/merchant/v1/payment/charge`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_token: customerToken,
          amount,
          currency: 'LKR',
          order_id: orderId,
          items: items.substring(0, 50),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        502,
        data?.msg || 'PayHere payment charge failed'
      );
    }

    return data;
  } catch (error: any) {
    throw new ApiError(500, error.message || 'PayHere Charging Error');
  }
};