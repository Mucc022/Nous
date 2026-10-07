import { jwtVerify, type JWTVerifyGetKey } from 'jose';
export async function verifyAccessIdentity(token: string, config: { issuer: string; audience: string; key: JWTVerifyGetKey }): Promise<string | null> {
  if (!token || !config.issuer || !config.audience) return null;
  try {
    const { payload } = await jwtVerify(token, config.key, { issuer: config.issuer, audience: config.audience, algorithms: ['RS256'], requiredClaims: ['sub', 'exp', 'iss', 'aud'] });
    return typeof payload.sub === 'string' && payload.sub.trim() ? payload.sub : null;
  } catch { return null; }
}
