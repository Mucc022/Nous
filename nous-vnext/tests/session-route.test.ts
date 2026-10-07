import assert from 'node:assert/strict';
import test from 'node:test';
import { GET } from '../app/api/session/route';
test('session endpoint never turns caller-supplied identity into a login', async () => {
  const response = await GET(new Request('http://localhost/api/session', { headers: { 'oai-authenticated-user-id': 'admin', 'cf-access-authenticated-user-email': 'admin@example.test' } }));
  assert.equal(response.status, 401);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await response.json(), { authenticated: false });
});
