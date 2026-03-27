/**
 * Email API Configuration
 * Hardcoded Email API URL for sending notifications
 */

export const EMAIL_API_URL = 'https://emailapi-brqsucjg.manus.space/api/trpc';

/**
 * Send order notification to owners
 */
export async function sendOrderNotification(orderData: {
  name: string;
  email: string;
  phone: string;
  items: Array<{
    productName: string;
    variant: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number | string;
  notes?: string;
  orderId: number;
}) {
  try {
    const response = await fetch(`${EMAIL_API_URL}/jackiePeanuts.sendOrder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ json: orderData })
    });

    const result = await response.json();
    return result.result?.data?.success || false;
  } catch (error) {
    console.error('Error sending order notification:', error);
    return false;
  }
}

/**
 * Send wholesale inquiry notification to owners
 */
export async function sendWholesaleNotification(inquiryData: {
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
}) {
  try {
    const response = await fetch(`${EMAIL_API_URL}/jackiePeanuts.sendWholesale`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ json: inquiryData })
    });

    const result = await response.json();
    return result.result?.data?.success || false;
  } catch (error) {
    console.error('Error sending wholesale notification:', error);
    return false;
  }
}

/**
 * Send subscriber notification to owners
 */
export async function sendSubscriberNotification(subscriberData: {
  email: string;
  name?: string;
}) {
  try {
    const response = await fetch(`${EMAIL_API_URL}/jackiePeanuts.sendSubscriber`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ json: subscriberData })
    });

    const result = await response.json();
    return result.result?.data?.success || false;
  } catch (error) {
    console.error('Error sending subscriber notification:', error);
    return false;
  }
}

/**
 * Send broadcast email to multiple recipients
 */
export async function sendBroadcastEmail(broadcastData: {
  emails: string[];
  subject: string;
  message: string;
}) {
  try {
    const response = await fetch(`${EMAIL_API_URL}/jackiePeanuts.sendBroadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ json: broadcastData })
    });

    const result = await response.json();
    return result.result?.data?.success || false;
  } catch (error) {
    console.error('Error sending broadcast email:', error);
    return false;
  }
}
