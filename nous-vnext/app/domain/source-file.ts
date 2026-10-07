export async function readSourceFile(file: File): Promise<{ title: string; text: string }> {
  if (!/\.(txt|md|srt)$/i.test(file.name)) throw new Error('目前支持 .txt、.md 和 .srt 字幕；录音请先转成文字');
  if (file.size > 2 * 1024 * 1024) throw new Error('原文文件不能超过 2 MB，请拆分后导入');
  const text = new TextDecoder('utf-8', { fatal: true }).decode(await file.arrayBuffer());
  if (!text.trim()) throw new Error('原文内容为空');
  return { title: file.name, text };
}
