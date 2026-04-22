export const sendSms = async (mobile: string, message: string) => {
  try {
    const API_KEY = process.env.SMSLENZ_API_KEY;
    const SENDER_ID = process.env.SMSLENZ_SENDER_ID || 'LaundryApp';

    const url = `https://smslenz.com/api/v1/send?api_key=${API_KEY}&to=${mobile}&message=${encodeURIComponent(message)}&sender_id=${SENDER_ID}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'success') {
      return true;
    }

    console.error('SMSlenz Error:', data);
    return false;
  } catch (error) {
    console.error('SMS Sending Failed:', error);
    return false;
  }
};