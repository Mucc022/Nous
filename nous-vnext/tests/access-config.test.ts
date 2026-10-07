import assert from 'node:assert/strict';
import test from 'node:test';
import { accessConfig } from '../app/domain/access-config';
test('Access config derives keys only from exact HTTPS team origin', () => {
  assert.deepEqual(accessConfig('https://team.cloudflareaccess.com', 'app-id'), { issuer: 'https://team.cloudflareaccess.com', audience: 'app-id', jwksUrl: 'https://team.cloudflareaccess.com/cdn-cgi/access/certs' });
  for (const issuer of ['http://team.cloudflareaccess.com', 'https://team.cloudflareaccess.com.evil.test', 'https://user:pass@team.cloudflareaccess.com', 'https://team.cloudflareaccess.com/path', 'https://localhost', undefined]) assert.equal(accessConfig(issuer, 'app-id'), null);
  assert.equal(accessConfig('https://team.cloudflareaccess.com', ''), null);
});
