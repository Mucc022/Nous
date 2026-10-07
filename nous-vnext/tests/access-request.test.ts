import assert from 'node:assert/strict';
import test from 'node:test';
import { authenticateAccessRequest } from '../app/domain/access-request';
test('request adapter refuses absent config and plaintext identity headers', async () => {
  const spoof = new Headers({ 'oai-authenticated-user-id': 'admin', 'cf-access-authenticated-user-email': 'admin@example.test' });
  assert.equal(await authenticateAccessRequest(spoof, {}), null);
  assert.equal(await authenticateAccessRequest(spoof, { issuer: 'https://team.cloudflareaccess.com', audience: 'app' }), null);
});
test('malformed assertion and foreign issuer configuration fail closed', async () => {
  const headers = new Headers({ 'cf-access-jwt-assertion': 'forged' });
  assert.equal(await authenticateAccessRequest(headers, { issuer: 'http://localhost', audience: 'app' }), null);
  assert.equal(await authenticateAccessRequest(headers, { issuer: 'https://team.cloudflareaccess.com', audience: 'app' }), null);
});
