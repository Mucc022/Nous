export class PayloadTooLargeError extends Error {
  constructor() { super('Request payload too large'); }
}
export async function readBoundedJson(request: Request, maxBytes = 65_536): Promise<unknown> {
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 1) throw new Error('Invalid request limit');
  if (!request.body) throw new Error('Missing JSON body');
  const reader = request.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let bytes = 0, text = '';
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      bytes += part.value.byteLength;
      if (bytes > maxBytes) { await reader.cancel(); throw new PayloadTooLargeError(); }
      text += decoder.decode(part.value, { stream: true });
    }
    text += decoder.decode();
    return JSON.parse(text);
  } finally { reader.releaseLock(); }
}
