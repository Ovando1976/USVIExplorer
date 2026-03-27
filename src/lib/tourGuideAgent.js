const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export async function askTourGuide(message, context = '') {
  const response = await fetch(`${API_BASE}/api/v1/tour-guide/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      context: context
        ? {
            route: window.location.pathname,
            selectedFeature: {
              description: context
            }
          }
        : undefined
    })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const requestTag = payload.requestId ? ` (request ${payload.requestId})` : '';
    throw new Error((payload.error || 'Tour guide request failed.') + requestTag);
  }

  return payload.reply;
}
