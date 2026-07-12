export async function request(method, endpoint, payload) {
  let res;
  try {
    res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      ...(payload !== undefined && { body: JSON.stringify(payload) }),
    });
  } catch {
    throw new Error('Could not reach the server. Please try again.');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong.');
  }
  return data;
}
