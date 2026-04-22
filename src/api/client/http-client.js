export async function mockRequest(payload, latency = 80) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(payload), latency);
  });
}
