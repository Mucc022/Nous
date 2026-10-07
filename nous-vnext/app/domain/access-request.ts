import { createRemoteJWKSet } from 'jose';
import { accessConfig } from './access-config';
import { verifyAccessIdentity } from './access-identity';

const keys = new Map<string, ReturnType<typeof createRemoteJWKSet>>();
export async function authenticateAccessRequest(headers: Headers, settings: { issuer?: string; audience?: string }): Promise<string | null> {
  const config = accessConfig(settings.issuer, settings.audience);
  const token = headers.get('cf-access-jwt-assertion');
  if (!config || !token || token.length > 16_384) return null;
  let key = keys.get(config.jwksUrl);
  if (!key) { key = createRemoteJWKSet(new URL(config.jwksUrl), { timeoutDuration: 5000 }); keys.set(config.jwksUrl, key); }
  return verifyAccessIdentity(token, { ...config, key });
}
