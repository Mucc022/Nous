import type { NousPackage, SourceDocument } from "./content";
import { parseAndValidateNousPackage, validateNousPackage, type ValidationIssue } from "./validator";

export type ImportPreview = { package: NousPackage | null; errors: ValidationIssue[]; warnings: ValidationIssue[]; cards: number; questions: number; sources: number; coverage?: { referencedChunks: number; totalChunks: number } };

export function previewImport(json: string, availableSources: SourceDocument[] = []): ImportPreview {
  try {
    const parsed = JSON.parse(json) as NousPackage;
    const mergedSources = parsed;
    const result = validateNousPackage(mergedSources);
    if (result.errors.some(issue => issue.message.startsWith('Schema:'))) {
      return { package: null, errors: result.errors, warnings: result.warnings, cards: 0, questions: 0, sources: 0 };
    }
    if (Array.isArray(parsed.sources)) {
      parsed.sources.forEach((source, index) => {
        const saved = availableSources.find(item => item.sourceId === source.sourceId);
        if (!saved) result.errors.push({ path: `$.sources[${index}]`, message: '请先在 Source Store 保存这份原始资料', severity: 'error' });
        else if (source.sha256 !== saved.sha256 || source.chunks.length !== saved.chunks.length || source.chunks.some((chunk, i) => {
          const original = saved.chunks[i];
          return chunk.chunkId !== original.chunkId || chunk.text !== original.text || chunk.index !== original.index;
        })) result.errors.push({ path: `$.sources[${index}]`, message: '来源内容与已保存的原始资料不一致', severity: 'error' });
      });
    }
    result.valid = result.errors.length === 0;
    const questions = mergedSources.cards?.reduce((total, card) => total + (card.questions?.length ?? 0), 0) ?? 0;
    const available = new Set(mergedSources.sources.flatMap(source => source.chunks.map(chunk => JSON.stringify([source.sourceId, chunk.chunkId]))));
    const referenced = new Set(mergedSources.cards.flatMap(card => card.questions.flatMap(question => question.sourceRefs.map(ref => JSON.stringify([ref.sourceId, ref.chunkId])))).filter(key => available.has(key)));
    return { package: result.valid ? mergedSources : null, errors: result.errors, warnings: result.warnings, cards: mergedSources.cards?.length ?? 0, questions, sources: mergedSources.sources?.length ?? 0, coverage: { referencedChunks: referenced.size, totalChunks: available.size } };
  } catch {
    return { package: null, errors: [{ path: "$", message: "Import must be valid JSON", severity: "error" }], warnings: [], cards: 0, questions: 0, sources: 0 };
  }
}

export function importPackage(json: string, availableSources: SourceDocument[] = []): NousPackage {
  const preview = previewImport(json, availableSources);
  if (preview.errors.length) throw new Error(preview.errors.map((error) => `${error.path}: ${error.message}`).join("; "));
  return parseAndValidateNousPackage(JSON.stringify(preview.package));
}
