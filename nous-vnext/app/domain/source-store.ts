import type { SourceChunk, SourceDocument } from "./content";

export function normalizeSourceText(input: string): string {
  return input.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").trim();
}

export async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function chunkSourceText(text: string, maxChars = 1200): SourceChunk[] {
  if (!Number.isInteger(maxChars) || maxChars < 2) throw new Error('Chunk size must be an integer of at least 2');
  const normalized = normalizeSourceText(text);
  if (!normalized) return [];
  const paragraphs = normalized.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
  const chunks: SourceChunk[] = [];
  let buffer = "";
  for (const paragraph of paragraphs) {
    if (paragraph.length > maxChars) {
      if (buffer) {
        chunks.push({ chunkId: `chunk_${String(chunks.length + 1).padStart(4, "0")}`, text: buffer, index: chunks.length });
        buffer = '';
      }
      for (let offset = 0; offset < paragraph.length;) {
        let end = Math.min(offset + maxChars, paragraph.length);
        if (end < paragraph.length && /[\uD800-\uDBFF]/.test(paragraph[end - 1])) end--;
        chunks.push({ chunkId: `chunk_${String(chunks.length + 1).padStart(4, "0")}`, text: paragraph.slice(offset, end), index: chunks.length });
        offset = end;
      }
      continue;
    }
    if (buffer && buffer.length + paragraph.length + 2 > maxChars) {
      chunks.push({ chunkId: `chunk_${String(chunks.length + 1).padStart(4, "0")}`, text: buffer, index: chunks.length });
      buffer = "";
    }
    buffer = buffer ? `${buffer}\n\n${paragraph}` : paragraph;
  }
  if (buffer) chunks.push({ chunkId: `chunk_${String(chunks.length + 1).padStart(4, "0")}`, text: buffer, index: chunks.length });
  return chunks;
}

export async function createSourceDocument(sourceId: string, title: string, rawText: string, maxChars?: number): Promise<SourceDocument> {
  const text = normalizeSourceText(rawText);
  if (!text) throw new Error("Source text cannot be empty");
  return { sourceId, title: title.trim() || "Untitled source", sha256: await sha256Hex(text), chunks: chunkSourceText(text, maxChars) };
}
