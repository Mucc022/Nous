import assert from 'node:assert/strict';
import test from 'node:test';
import { GET, POST } from '../app/api/reviews/route';
test('review routes reject unauthenticated requests before database access', async () => {
  for (const handler of [GET, POST]) {
    const request = new Request('http://localhost/api/reviews', { headers: { 'oai-authenticated-user-id': 'spoofed', 'cf-access-authenticated-user-email': 'spoof@example.test' } });
    const response = await handler(request);
    assert.equal(response.status, 401);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.deepEqual(await response.json(), { error: 'authentication_required' });
  }
});
