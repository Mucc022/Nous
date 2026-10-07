"use client";

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { FolderRepository, resolveFolderStyle, type LibraryFolder } from './domain/folder-repository';
import { FolderIcon, iconGroups } from './folder-icons';
import { SidebarIcon } from './sidebar-icon';

type Props = {
  cards: { folder: string }[];
  selected: string | null;
  onSelect: (id: string | null, title: string) => void;
  children?: React.ReactNode;
  onChange?: () => void;
};

export function FolderTree({ cards, selected, onSelect, children, onChange }: Props) {
  const [revision, setRevision] = useState(0);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [rootExpanded, setRootExpanded] = useState(true);
  const [menu, setMenu] = useState<{ parentId: string | null; x: number; y: number } | null>(null);
  const [draft, setDraft] = useState<{ parentId: string | null; parentName: string; editId?:string } | null>(null);
  const [icon, setIcon] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [iconQuery, setIconQuery] = useState('');
  const [iconGroup, setIconGroup] = useState('学习与知识');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuPanel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressed = useRef(false);
  useEffect(() => { const stop = () => { if (pressTimer.current) clearTimeout(pressTimer.current); }; window.addEventListener('pointerup',stop); window.addEventListener('pointercancel',stop); return () => { stop(); window.removeEventListener('pointerup',stop); window.removeEventListener('pointercancel',stop); }; },[]);
  const legacyNames = cards.map(card => card.folder);
  let folders: LibraryFolder[] = [];
  let readError = '';
  try {
    if (typeof window !== 'undefined') folders = new FolderRepository(window.localStorage).list(legacyNames);
  } catch (failure) { readError = failure instanceof Error ? failure.message : '文件夹读取失败'; }
  // revision rerenders after a successful storage write; never rewrite data in an effect.
  void revision;

  useEffect(() => {
    if (!menu) return;
    menuButton.current?.focus();
    const dismiss = () => { setMenu(null); trigger.current?.focus({ preventScroll: true }); };
    const outsidePointer = (event: PointerEvent) => {
      if (event.target instanceof Node && menuPanel.current?.contains(event.target)) return;
      dismiss();
    };
    const keydown = (event: KeyboardEvent) => { if (event.key === 'Escape' || event.key === 'Tab') dismiss(); };
    document.addEventListener('pointerdown', outsidePointer);
    document.addEventListener('keydown', keydown);
    window.addEventListener('resize', dismiss);
    window.addEventListener('scroll', dismiss, true);
    return () => {
      document.removeEventListener('pointerdown', outsidePointer);
      document.removeEventListener('keydown', keydown);
      window.removeEventListener('resize', dismiss);
      window.removeEventListener('scroll', dismiss, true);
    };
  }, [menu]);

  useEffect(() => { if (draft) { dialog.current?.showModal(); nameInput.current?.focus(); } }, [draft]);

  function openMenu(event: MouseEvent<HTMLElement>, parentId: string | null) {
    event.preventDefault();
    trigger.current = event.currentTarget;
    const bounds = event.currentTarget.getBoundingClientRect();
    setMenu({ parentId, x: Math.max(8, Math.min(event.clientX || bounds.left, window.innerWidth - 240)), y: Math.max(8, Math.min(event.clientY || bounds.bottom, window.innerHeight - 200)) });
  }

  function closeDialog() { dialog.current?.close(); setDraft(null); trigger.current?.focus(); }

  function createFolder(event: React.FormEvent) {
    event.preventDefault();
    if (!draft) return;
    try {
      const repository = new FolderRepository(window.localStorage);
      const folder = draft.editId ? folders.find(item => item.id === draft.editId)! : repository.add(draft.parentId, name, legacyNames);
      if (draft.editId) repository.update(draft.editId, {name,icon,color}, legacyNames);
      setRevision(value => value + 1);
      onChange?.();
      setCollapsed(value => { const next = new Set(value); if (draft.parentId) next.delete(draft.parentId); return next; });
      if (!draft.editId || selected === folder.id) onSelect(folder.id, name.trim());
      closeDialog();
    } catch (failure) { setError(failure instanceof Error ? failure.message : '保存失败，请重试'); }
  }

  function renderFolders(parentId: string | null, depth: number): React.ReactNode {
    return folders.filter(folder => folder.parentId === parentId && !folder.deletedAt).map(folder => {
      const children = folders.some(child => child.parentId === folder.id);
      const expanded = !collapsed.has(folder.id);
      const style = resolveFolderStyle(folder.id, folders);
      return <div key={folder.id}>
        <div className={`folder-row ${selected === folder.id ? 'active' : ''}`} style={{ paddingLeft: 8 + depth * 16 }} onPointerDown={event => { if (event.button !== 0) return; longPressed.current=false; const x=event.clientX,y=event.clientY; trigger.current=event.target as HTMLElement; pressTimer.current=setTimeout(() => { longPressed.current=true; setMenu({parentId:folder.id,x:Math.max(8,Math.min(x,window.innerWidth-220)),y:Math.max(8,Math.min(y,window.innerHeight-180))}); },500); }} onPointerMove={() => { if (pressTimer.current) clearTimeout(pressTimer.current); }} onClickCapture={event => { if (longPressed.current) {event.stopPropagation();event.preventDefault();longPressed.current=false;} }}>
          {children ? <button className="folder-toggle" aria-label={`${expanded ? '收起' : '展开'} ${folder.name}`} aria-expanded={expanded} onClick={() => setCollapsed(value => { const next = new Set(value); if (next.has(folder.id)) next.delete(folder.id); else next.add(folder.id); return next; })}><span className="folder-chevron" aria-hidden="true">▸</span></button> : <span className="folder-leaf" aria-hidden="true">·</span>}
          <button className="tree-item folder-select" title={`${folder.name}（右键编辑）`} onClick={() => onSelect(folder.id, folder.name)} onContextMenu={event => openMenu(event, folder.id)} onKeyDown={event => { if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) { event.preventDefault(); trigger.current = event.currentTarget; const rect = event.currentTarget.getBoundingClientRect(); setMenu({ parentId: folder.id, x: Math.max(8, Math.min(rect.left, window.innerWidth - 240)), y: Math.max(8,Math.min(rect.bottom, window.innerHeight - 200)) }); } }}><FolderIcon name={style.icon} color={style.color}/><span className="folder-name">{folder.name}</span><em>{cards.filter(card => card.folder === folder.legacyName).length}</em></button>
        </div>
        {children && <div className={`folder-collapse ${expanded ? 'is-expanded' : ''}`} inert={!expanded} aria-hidden={!expanded}><div className="folder-collapse-inner">{renderFolders(folder.id, depth + 1)}</div></div>}
      </div>;
    });
  }

  return <>
    <nav className="tree" aria-label="卡片库导航">
      <div className="library-root">
        <button className="library-root-select" onClick={() => onSelect(null, '全部卡片')} onContextMenu={event => openMenu(event, null)}><SidebarIcon name="cards"/><span>卡片库</span><span className="library-root-count">{cards.length}</span></button>
        <button className="library-root-toggle" aria-label={`${rootExpanded ? '收起' : '展开'}卡片库`} aria-expanded={rootExpanded} aria-controls="library-folder-children" onClick={() => setRootExpanded(value => !value)}><span className="folder-chevron" aria-hidden="true">▸</span></button>
      </div>
      {readError && <p role="alert">{readError}。原数据未修改。</p>}
      <div id="library-folder-children" className={`folder-collapse ${rootExpanded ? 'is-expanded' : ''}`} inert={!rootExpanded} aria-hidden={!rootExpanded}><div className="folder-collapse-inner">
        {children}
        <div className="library-section-label">文件夹 <span>右键新建</span></div>
        {!readError && renderFolders(null, 0)}
        {!readError && !folders.length && <p>尚无卡组，请先导入资料，或右键“全部卡片”新建文件夹。</p>}
      </div></div>
    </nav>
    {menu && <div ref={menuPanel} className="folder-context-menu" role="menu" aria-label="文件夹操作" style={{ left: menu.x, top: menu.y }}>
      {menu.parentId && <button role="menuitem" className="trash-action" onClick={() => { try { new FolderRepository(window.localStorage).setTrash(menu.parentId!,true,legacyNames); setRevision(value=>value+1); onChange?.(); onSelect(null,'全部卡组'); setMenu(null); } catch (failure) {setError(failure instanceof Error ? failure.message : '操作失败');} }}>移到废纸篓</button>}
      {menu.parentId && <button role="menuitem" disabled={!!readError} onClick={() => { const folder = folders.find(item => item.id === menu.parentId)!; setDraft({parentId:folder.parentId,parentName:folders.find(item => item.id === folder.parentId)?.name ?? '知识库',editId:folder.id}); setName(folder.name); setIcon(folder.icon ?? null); setColor(folder.color ?? null); setIconQuery(''); setError(''); setMenu(null); }}><SidebarIcon name="settings"/>编辑名称、图标与颜色</button>}
      <button ref={menuButton} role="menuitem" disabled={!!readError} onClick={() => { setDraft({ parentId: menu.parentId, parentName: folders.find(folder => folder.id === menu.parentId)?.name ?? '知识库' }); setName(''); setError(''); setMenu(null); }}>＋ {menu.parentId === null ? '新建文件夹' : '新建子文件夹'}</button>
    </div>}
    <dialog ref={dialog} className="folder-dialog" aria-labelledby="folder-dialog-title" onCancel={closeDialog}>
      <form onSubmit={createFolder}>
        <h2 id="folder-dialog-title">{draft?.editId ? '编辑文件夹' : draft?.parentId === null ? '新建文件夹' : '新建子文件夹'}</h2>
        <p>创建位置：{draft?.parentName}</p>
        <label>文件夹名称<input ref={nameInput} value={name} onChange={event => { setName(event.target.value); setError(''); }} maxLength={80} placeholder="例如：第一课" /></label>
        {draft?.editId && <>
          <div className="folder-style-preview"><FolderIcon name={icon ?? resolveFolderStyle(draft.parentId ?? '',folders).icon} color={color ?? resolveFolderStyle(draft.parentId ?? '',folders).color}/><strong>{name || '文件夹'}</strong></div>
          <fieldset className="folder-style-field"><legend>图标</legend><button type="button" className="quiet-button" aria-pressed={icon === null} onClick={() => setIcon(null)}>继承上级 / 默认</button><input aria-label="搜索图标" placeholder="搜索图标（如 Book、Cloud）" value={iconQuery} onChange={event => setIconQuery(event.target.value)}/><div className="icon-categories">{Object.keys(iconGroups).map(group => <button type="button" key={group} aria-pressed={iconGroup === group} onClick={() => setIconGroup(group)}>{group}</button>)}</div><div className="folder-icon-grid">{(iconQuery ? Object.values(iconGroups).flat().filter(value => value.toLowerCase().includes(iconQuery.toLowerCase())) : iconGroups[iconGroup]).map(value => <button type="button" key={value} title={value} aria-label={value} aria-pressed={icon === value} onClick={() => setIcon(value)}><FolderIcon name={value} color={color}/></button>)}</div></fieldset>
          <fieldset className="folder-style-field"><legend>颜色</legend><button type="button" className="quiet-button" aria-pressed={color === null} onClick={() => setColor(null)}>继承上级 / 系统强调色</button><div className="folder-color-grid">{['#db4679','#ef4444','#e68924','#b0be32','#25bf62','#275e42','#168aad','#4f6aa0','#8b5cf6','#79538c','#9a624b','#67747d'].map(value => <button type="button" key={value} aria-label={`颜色 ${value}`} aria-pressed={color === value} style={{background:value}} onClick={() => setColor(value)}/>)}</div><label>自定义颜色<input type="color" value={color ?? '#25bf62'} onChange={event => setColor(event.target.value)}/></label></fieldset>
          <p>未单独设置的子文件夹，会随上级图标与颜色一起变化。</p>
        </>}
        {error && <p role="alert" className="folder-error">{error}</p>}
        <div className="folder-dialog-actions"><button type="button" className="quiet-button" onClick={closeDialog}>取消</button><button className="create-button" type="submit" disabled={!name.trim()}>{draft?.editId ? '保存' : '创建'}</button></div>
      </form>
    </dialog>
  </>;
}
