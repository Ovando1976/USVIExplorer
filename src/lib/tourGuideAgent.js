export async function askTourGuide(message, context = '') {
  const response = await fetch('/api/v1/tour-guide/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message, context })
  });

  if (!response.ok) {
    throw new Error(`Tour guide request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.reply || 'I could not find an answer right now.';
}
