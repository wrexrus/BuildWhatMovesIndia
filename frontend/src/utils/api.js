const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function fetchApi(endpoint, options = {}) {
  try {
    const token = localStorage.getItem('gst_auth_token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `HTTP ${response.status} Error`);
    }
    return await response.json();
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err.message);
    throw err;
  }
}

export async function loginApi(email, password) {
  return fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerApi(formData) {
  return fetchApi('/auth/register', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
}

export async function mockLoginApi() {
  return fetchApi('/auth/mock-login', {
    method: 'POST',
  });
}

export async function fetchUserProfile() {
  return fetchApi('/auth/profile');
}

export async function searchTaxpayerByGSTIN(gstin) {
  return fetchApi(`/services/search-taxpayer/${encodeURIComponent(gstin)}`);
}

export async function trackReturnsByGSTIN(gstin) {
  return fetchApi(`/services/track-returns/${encodeURIComponent(gstin)}`);
}

export async function lookupHSN(query) {
  return fetchApi(`/services/hsn-lookup?q=${encodeURIComponent(query)}`);
}

export async function fetchInvoices() {
  return fetchApi('/invoices');
}

export async function runReconciliation(language = 'EN', gstin = '27AAAAA1234A1Z5') {
  return fetchApi('/reconcile', {
    method: 'POST',
    body: JSON.stringify({ language, gstin }),
  });
}

export async function resolveMismatch(invoiceId, invoiceNumber, actionType) {
  return fetchApi('/invoices/resolve', {
    method: 'POST',
    body: JSON.stringify({ invoiceId, invoiceNumber, actionType }),
  });
}

export async function submitGstr3bReturn() {
  return fetchApi('/gstr3b/submit', {
    method: 'POST',
  });
}

export async function sendChatbotQuery(query, language = 'EN', userContext = null, explanationMode = 'SHOPKEEPER') {
  return fetchApi('/chat/guide', {
    method: 'POST',
    body: JSON.stringify({ query, language, activeContext: userContext, explanationMode }),
  });
}

export async function sendCopilotQuery(query, language = 'HI', pageContext = 'HOME', userGstin = null, explanationMode = 'SHOPKEEPER') {
  return fetchApi('/chat/copilot', {
    method: 'POST',
    body: JSON.stringify({ query, language, pageContext, userGstin, explanationMode }),
  });
}

export async function fetchAccountHarness(gstin = '', language = 'HI') {
  const gstinParam = gstin ? encodeURIComponent(gstin) : '';
  return fetchApi(`/chat/harness/${gstinParam}?lang=${encodeURIComponent(language)}`);
}

export async function getVoiceExplanation(invoiceNumber = 'AP/2026/045', language = 'HI') {
  return fetchApi('/explain-voice', {
    method: 'POST',
    body: JSON.stringify({ invoiceNumber, language }),
  });
}

export async function fetchOfflineTools() {
  return fetchApi('/services/offline-tools');
}


export async function fetchGstStatistics() {
  return fetchApi('/services/gst-statistics');
}

export async function resetInvoicesApi() {
  return fetchApi('/invoices/reset', {
    method: 'POST',
  });
}
