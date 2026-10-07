"use client";

import { useEffect, useRef, useState } from 'react';

const steps = [
  { title: '先准备课堂文字', body: '有录音？先用你常用的转录工具转成文字或 SRT 字幕。已有课堂字幕，可以直接选择文件，无需去掉时间戳。', tip: '支持 UTF-8 的 .txt、.md、.srt 文件，单份最多 2 MB。' },
  { title: '选中桌面的资料', body: '点击“AI 导入”，再点“选择电脑里的资料”。在弹出的窗口里打开“桌面”，选中你的文件，网站会自动保存，并显示本次文件名。', tip: '不用先复制字幕，也不用手动填写标题。下次可以从已保存的资料中选择。' },
  { title: '让 AI 帮你出题', body: '点击“复制这份资料的出题提示词”，直接粘贴到 Chatsol 或你常用的 AI 对话里发送。复制内容已经包含本次原文，无需再附文件或补充说明。', tip: '复制内容包含课堂资料，请确认适合分享给你选择的 AI 服务。目前出题需要在外部 AI 中完成。' },
  { title: '把题库带回 Nous', body: '复制 AI 生成的完整 JSON 题库包，粘贴到导入面板下方。点击“预览题库”，检查结果，再点击“确认导入”。验证不通过时，把提示交给 AI 修改后再试。', tip: 'JSON 是题库的保存格式；提示词会告诉 AI 怎么生成，你无需自己写代码。' },
  { title: '开始学习，再回来复习', body: '打开一张卡片，先凭记忆答题并提交，再查看反馈、写笔记，并选择“记住、模糊、忘记”。以后点击“今日复习”，系统会按学习记录安排题目。', tip: '资料和进度保存在当前浏览器。继续使用同一地址，并定期点击“导出备份”。' },
];

export function GettingStarted({ onImport }: { onImport: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState(0);
  useEffect(() => {
    try { if (window.localStorage.getItem('nous.onboarding.v1') !== 'seen') dialog.current?.showModal(); }
    catch { /* Help remains available if browser storage is unavailable. */ }
  }, []);
  function close() {
    try { window.localStorage.setItem('nous.onboarding.v1', 'seen'); } catch { /* No data is overwritten. */ }
    dialog.current?.close();
  }
  const current = steps[step];
  return <>
    <button className="quiet-button tutorial-entry" onClick={() => { setStep(0); dialog.current?.showModal(); }}>新手教程</button>
    <dialog ref={dialog} className="onboarding-dialog" aria-labelledby="onboarding-title" onCancel={close}>
      <div className="onboarding-heading"><span>从一份课堂资料开始</span><button className="icon-button" aria-label="关闭新手教程" onClick={close}>×</button></div>
      <nav className="onboarding-steps" aria-label="教程步骤">{steps.map((item, index) => <button key={item.title} aria-label={`第 ${index + 1} 步：${item.title}`} aria-current={step === index ? 'step' : undefined} className={step === index ? 'active' : ''} onClick={() => setStep(index)}>{index + 1}</button>)}</nav>
      <p className="onboarding-progress">第 {step + 1} 步，共 {steps.length} 步</p>
      <h2 id="onboarding-title">{current.title}</h2>
      <p className="onboarding-body">{current.body}</p>
      <p className="onboarding-tip">{current.tip}</p>
      <div className="onboarding-actions"><button className="quiet-button" onClick={close}>稍后再看</button><div>{step > 0 && <button className="quiet-button" onClick={() => setStep(value => value - 1)}>上一步</button>}{step < steps.length - 1 ? <button className="primary-button" onClick={() => setStep(value => value + 1)}>下一步</button> : <button className="primary-button" onClick={() => { close(); onImport(); }}>导入我的第一份资料</button>}</div></div>
    </dialog>
  </>;
}
