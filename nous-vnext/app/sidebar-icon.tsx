import type { ReactNode } from 'react';
import { Settings, Trash2 } from 'lucide-react';

type Icon = 'cards' | 'spark' | 'clock' | 'progress' | 'check' | 'tag' | 'folder' | 'sun' | 'chart' | 'search' | 'settings' | 'trash';

export function SidebarIcon({ name }: { name: Icon }) {
  if (name === 'settings' || name === 'trash') {
    const IconComponent = name === 'settings' ? Settings : Trash2;
    return <IconComponent className="sidebar-icon" strokeWidth={1.8} aria-hidden="true"/>;
  }
  const paths: Record<Exclude<Icon, 'settings' | 'trash'>, ReactNode> = {
    cards: <><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4M3 7v13a2 2 0 0 0 2 2h12"/></>,
    spark: <><path d="m12 3 1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8L12 3Z"/><path d="M19 18v4M17 20h4"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></>,
    progress: <><circle cx="12" cy="12" r="9"/><path d="M12 3v9l5 3"/></>,
    check: <><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></>,
    tag: <><path d="M3 5a2 2 0 0 1 2-2h7l9 9-9 9-9-9V5Z"/><circle cx="8" cy="8" r="1"/></>,
    folder: <><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
    chart: <><path d="M4 20V12h4v8M10 20V8h4v12M16 20V4h4v16M2 20h20"/></>,
    search: <><circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/></>,
  };
  return <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
