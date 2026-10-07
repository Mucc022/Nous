"use client";
import { useEffect, useRef, useState } from 'react';
import { accentPalette, DEFAULT_ACCENT } from './domain/theme';
import { SidebarIcon } from './sidebar-icon';
import { GettingStarted } from './getting-started';

function applyAccent(color: string) {
  const palette = accentPalette(color);
  Object.entries(palette).forEach(([name, value]) => document.documentElement.style.setProperty(`--theme-${name}`, value));
}
export function ThemeSettings({ onBackup, onImport }: { onBackup: () => void; onImport: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [color, setColor] = useState(DEFAULT_ACCENT);
  const [density, setDensity] = useState('compact');
  const [message, setMessage] = useState('');
  useEffect(() => {
    let saved = DEFAULT_ACCENT;
    try { const value = window.localStorage.getItem('nous.accent.v1'); if (value && /^#[0-9a-f]{6}$/i.test(value)) saved = value; } catch { /* Default theme remains usable. */ }
    applyAccent(saved);
    let savedDensity = 'compact';
    try { const value = window.localStorage.getItem('nous.nav-density.v1'); if (value && ['compact', 'normal', 'wide'].includes(value)) savedDensity = value; } catch { /* Use the compact default. */ }
    document.documentElement.setAttribute('data-nav-density', savedDensity);
    const frame = requestAnimationFrame(() => { setColor(saved); setDensity(savedDensity); });
    return () => cancelAnimationFrame(frame);
  }, []);
  function update(value: string) {
    setColor(value); applyAccent(value);
    try { window.localStorage.setItem('nous.accent.v1', value); setMessage('已自动保存，下次打开仍会使用这个颜色。'); }
    catch { setMessage('颜色已应用，但浏览器无法保存；刷新后会恢复默认。'); }
  }
  function updateDensity(value: string) {
    setDensity(value); document.documentElement.setAttribute('data-nav-density', value);
    try { window.localStorage.setItem('nous.nav-density.v1', value); setMessage('导航间距已自动保存。'); }
    catch { setMessage('导航间距已应用，但浏览器无法保存。'); }
  }
  const palette = accentPalette(color);
  return <>
    <button className="nav-link sidebar-action settings-entry" aria-label="设置" onClick={() => dialog.current?.showModal()}><SidebarIcon name="settings"/><span>设置</span></button>
    <dialog ref={dialog} className="onboarding-dialog theme-dialog" aria-labelledby="theme-title">
      <div className="onboarding-heading"><span>设置 · 外观与偏好</span><button className="icon-button" aria-label="关闭设置" onClick={() => dialog.current?.close()}>×</button></div>
      <h2 id="theme-title">选一个你喜欢的主题色</h2><p className="onboarding-body">按钮、导航、选中状态会一起更新。浅色和深色由系统自动搭配。</p>
      <div className="theme-presets">{[['草绿','#25bf62'],['湖蓝','#168aad'],['紫罗兰','#8b5cf6'],['玫瑰','#db4679'],['琥珀','#d59a20']].map(([name,value]) => <button key={value} aria-label={name} aria-pressed={color === value} style={{background:value}} onClick={() => update(value)}/>)}</div>
      <label className="theme-custom">自定义颜色<input aria-label="自定义主题色" type="color" value={color} onChange={event => update(event.target.value)}/><span>{color}</span></label>
      <div className="theme-preview">{[['主色',palette.main],['浅色',palette.soft],['深色',palette.dark]].map(([label,value]) => <div key={label}><span style={{background:value}}/><small>{label}</small></div>)}</div>
      <fieldset className="density-setting"><legend>左侧导航间距</legend><div>{[['compact','紧凑'],['normal','正常'],['wide','宽松']].map(([value,label]) => <label key={value}><input type="radio" name="nav-density" value={value} checked={density === value} onChange={() => updateDensity(value)}/>{label}</label>)}</div><p>统一字号和图标大小，只调整行高与分组间距。</p></fieldset>
      <section className="settings-section"><h3>数据与帮助</h3><p>资料与学习记录保存在当前浏览器，建议定期备份。</p><div className="settings-tools"><button className="quiet-button" onClick={onBackup}>导出备份</button><GettingStarted onImport={() => { dialog.current?.close(); onImport(); }}/></div></section>
      <p className="source-count" role="status">{message || '实时预览，自动保存。错误和警告仍使用各自的提示色。'}</p><div className="onboarding-actions"><button className="quiet-button" onClick={() => update(DEFAULT_ACCENT)}>恢复默认</button><button className="primary-button" onClick={() => dialog.current?.close()}>完成</button></div>
    </dialog>
  </>;
}
