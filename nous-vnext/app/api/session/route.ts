import { authenticateAccessRequest } from '../../domain/access-request';

export async function GET(request: Request): Promise<Response> {
  const userId = await authenticateAccessRequest(request.headers, {
    issuer: process.env.NOUS_ACCESS_ISSUER,
    audience: process.env.NOUS_ACCESS_AUDIENCE,
  });
  return Response.json(userId ? { authenticated: true, userId } : { authenticated: false }, {
    status: userId ? 200 : 401,
    headers: { 'cache-control': 'no-store', vary: 'Cookie, Cf-Access-Jwt-Assertion' },
  });
}
