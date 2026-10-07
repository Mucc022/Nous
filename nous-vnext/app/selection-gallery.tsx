"use client";
import { Children, cloneElement, isValidElement, useEffect, useRef, useState, type ReactNode } from 'react';
export function SelectionGallery({ children, className, items, onTrash }: { children: ReactNode; className: string; items: string[][]; onTrash: (ids: string[]) => void }) {
  const [selected, setSelected] = useState<number[]>([]);
  const [mode, setMode] = useState(false);
  const [menu, setMenu] = useState<{x:number;y:number} | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const origin = useRef({x:0,y:0});
  const suppress = useRef(false);
  const dragging = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  function stopTimer() { if (timer.current) clearTimeout(timer.current); timer.current = null; }
  useEffect(() => { const up = () => { stopTimer(); dragging.current = false; }; window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up); return () => { up(); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); }; }, []);
  function indexOf(target: EventTarget | null) { const element = target instanceof Element ? target.closest('[data-select-index]') : null; return element && root.current?.contains(element) ? Number(element.getAttribute('data-select-index')) : -1; }
  const ids = [...new Set(selected.flatMap(index => items[index] ?? []))];
  function exit() { setMenu(null); setMode(false); setSelected([]); }
  function position(x:number,y:number) { return {x:Math.max(8,Math.min(x,window.innerWidth-250)),y:Math.max(8,Math.min(y,window.innerHeight-250))}; }
  return <>
    <div className="selection-toolbar"><button onClick={() => { if (mode) exit(); else setMode(true); }}>{mode ? '退出多选' : '多选'}</button>{mode && <><span role="status">已选 {selected.length} 项 · {ids.length} 张卡片</span><button onClick={() => setSelected(items.map((_,index) => index))}>全选</button><button disabled={!ids.length} onClick={() => { onTrash(ids); exit(); }}>移到废纸篓</button></>}</div>
    {/* Gallery delegates pointer selection; its child cards and toolbar remain keyboard-operable. */}
    {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
    <div ref={root} className={`${className} ${mode ? 'selection-mode' : ''}`} onPointerDownCapture={event => {
      if (event.button !== 0) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest('button') && target.closest('button') !== target.closest('[data-select-index]')) return;
      const index = indexOf(event.target); if (index < 0) return;
      stopTimer(); origin.current = {x:event.clientX,y:event.clientY}; suppress.current = false;
      if (mode) { dragging.current = true; return; }
      const x = event.clientX, y = event.clientY;
      timer.current = setTimeout(() => { setMode(true); setSelected([index]); suppress.current = true; dragging.current = true; setMenu(position(x,y)); }, 500);
    }} onPointerMove={event => {
      if (Math.hypot(event.clientX-origin.current.x,event.clientY-origin.current.y)>8) stopTimer();
      if (mode && dragging.current && event.buttons === 1) { const index = indexOf(document.elementFromPoint(event.clientX,event.clientY)); if (index >= 0) { setMenu(null); setSelected(previous => previous.includes(index) ? previous : [...previous,index]); suppress.current = true; } }
    }} onClickCapture={event => {
      const index = indexOf(event.target); if (index < 0) return;
      if (mode || suppress.current) { event.preventDefault(); event.stopPropagation(); if (!suppress.current) setSelected(previous => previous.includes(index) ? previous.filter(value => value !== index) : [...previous,index]); suppress.current = false; }
    }} onContextMenu={event => {
      const index = indexOf(event.target); if (index < 0) return;
      event.preventDefault(); stopTimer(); if (!selected.includes(index)) setSelected([index]); setMenu(position(event.clientX,event.clientY));
    }} onKeyDown={event => { if (event.key === 'Escape') exit(); }}>
      {Children.map(children, (child,index) => isValidElement<{className?:string}>(child) ? cloneElement(child, {className:`${child.props.className ?? ''} ${selected.includes(index) ? 'is-selected' : ''}`, ...{'data-select-index':index}}) : child)}
    </div>
    {menu && <><button className="selection-menu-dismiss" aria-label="关闭操作菜单" onClick={() => setMenu(null)}/><div className="selection-menu" role="dialog" aria-label="卡片操作" style={{left:menu.x,top:menu.y}}><strong>已选 {ids.length} 张卡片</strong><button onClick={() => { setMode(true); setMenu(null); }}>多选</button><button onClick={() => { setMode(true); setSelected(items.map((_,index) => index)); setMenu(null); }}>全选当前页面</button><button className="trash-action" disabled={!ids.length} onClick={() => { onTrash(ids); exit(); }}>移到废纸篓</button><button onClick={exit}>取消选择</button></div></>}
  </>;
}
