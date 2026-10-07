import type { NousPackage } from './content';
import { sha256Hex } from './source-store';
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map(key => `${JSON.stringify(key)}:${canonical(record[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}
export async function packageIdentity(content: NousPackage): Promise<string> {
  return `pkg_${await sha256Hex(canonical(content))}`;
}
