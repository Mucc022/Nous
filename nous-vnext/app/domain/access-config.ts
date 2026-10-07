export function accessConfig(issuer: string | undefined, audience: string | undefined): { issuer: string; audience: string; jwksUrl: string } | null {
  if (!issuer || !audience?.trim()) return null;
  try {
    const url = new URL(issuer);
    if (url.protocol !== 'https:' || !/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(url.hostname) || url.username || url.password || url.port || url.pathname !== '/' || url.search || url.hash) return null;
    return { issuer: url.origin, audience: audience.trim(), jwksUrl: `${url.origin}/cdn-cgi/access/certs` };
  } catch { return null; }
}
