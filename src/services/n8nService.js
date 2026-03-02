/**Sends order data to n8n webhook for confirmation email + MockAPI update.*/

import axios from 'axios';

const WEBHOOK_URL = import.meta.env.VITE_N8N_ORDER_WEBHOOK_URL;

/**
 * @param {Object} orderData - { id, userName, userEmail, items, total }
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function sendOrderToN8n(orderData) {
  if (!WEBHOOK_URL || WEBHOOK_URL.trim() === '') {
    return {
      success: false,
      error: 'VITE_N8N_ORDER_WEBHOOK_URL is not set. Add it to your .env file.',
    };
  }

  const payload = {
    id: orderData.id,
    userName: orderData.userName,
    userEmail: orderData.userEmail,
    items: orderData.items || [],
    total: orderData.total,
  };

  try {
    const response = await axios.post(WEBHOOK_URL, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    });

    // Preferred: n8n responds with { success: true }
    if (response.data && response.data.success === true) {
      return { success: true };
    }

    // If the workflow runs but doesn't return JSON (common if there's no "Respond to Webhook" node),
    // treat any 2xx response as success so checkout can complete and cart can clear.
    if (response.status >= 200 && response.status < 300) {
      return { success: true };
    }

    return {
      success: false,
      error: response.data?.message || 'n8n did not return success.',
    };
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.message ||
      'Failed to send order to n8n.';
    return {
      success: false,
      error: message,
    };
  }
}
