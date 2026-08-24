const BASE_URL = 'http://localhost:5000/api';

/**
 * Generic fetch wrapper with fallback error handling
 */
async function fetchApi(endpoint, options = {}) {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
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

// 1. Search Taxpayer by GSTIN
export async function searchTaxpayerByGSTIN(gstin) {
  return fetchApi(`/services/search-taxpayer/${encodeURIComponent(gstin)}`);
}

// 2. Track Return Filing History by GSTIN
export async function trackReturnsByGSTIN(gstin) {
  return fetchApi(`/services/track-returns/${encodeURIComponent(gstin)}`);
}

// 3. HSN Code Lookup
export async function lookupHSN(query) {
  return fetchApi(`/services/hsn-lookup?q=${encodeURIComponent(query)}`);
}

// 4. Get Ramesh's Invoices
export async function fetchInvoices() {
  return fetchApi('/invoices');
}

// 5. Run Reconciliation Engine
export async function runReconciliation(language = 'EN') {
  return fetchApi('/reconcile', {
    method: 'POST',
    body: JSON.stringify({ language }),
  });
}

// 6. One-Click Mismatch Resolution
export async function resolveMismatch(invoiceId, invoiceNumber, actionType) {
  return fetchApi('/invoices/resolve', {
    method: 'POST',
    body: JSON.stringify({ invoiceId, invoiceNumber, actionType }),
  });
}

// 7. Submit GSTR-3B Return
export async function submitGstr3bReturn() {
  return fetchApi('/gstr3b/submit', {
    method: 'POST',
  });
}

// 8. Bounded GST Chatbot Guidance
export async function sendChatbotQuery(query, language = 'EN') {
  return fetchApi('/chat/guide', {
    method: 'POST',
    body: JSON.stringify({ query, language }),
  });
}
