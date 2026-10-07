import type { ReactNode } from 'react';

export function InfoTip({ label, children }: { label: string; children: ReactNode }) {
  return <details className="info-tip"><summary aria-label={label}>i</summary><div className="info-tip-content">{children}</div></details>;
}
