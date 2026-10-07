import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { importPackage, previewImport } from "../app/domain/import-pipeline";

const json = readFileSync(new URL("../fixtures/valid-package.json", import.meta.url), "utf8");

test('valid JSON with malformed collections reports schema errors rather than parse failure', () => {
  const result = previewImport('{"format":"nous-package-v0.1","sources":{},"cards":{}}');
  assert.equal(result.package, null);
  assert.ok(result.errors.some(issue => issue.message.startsWith('Schema:')));
  assert.ok(result.errors.every(issue => issue.message !== 'Import must be valid JSON'));
});
const trustedSources = JSON.parse(json).sources;

test('preview measures referenced chunks without claiming semantic coverage', () => {
  const p = JSON.parse(json);
  p.sources[0].chunks.push({ chunkId: 'unused', text: 'Another paragraph.', index: 1 });
  const preview = previewImport(JSON.stringify(p), p.sources);
  assert.deepEqual(preview.coverage, { referencedChunks: 1, totalChunks: 2 });
});
test("previews valid imports without accepting invalid content", () => {
  const preview = previewImport(json, trustedSources);
  assert.equal(preview.errors.length, 0); assert.equal(preview.cards, 1); assert.equal(preview.questions, 1); assert.ok(preview.package);
});
test("blocks malformed JSON", () => assert.equal(previewImport("not json").package, null));
test("import returns a validated package", () => assert.equal(importPackage(json, trustedSources).format, "nous-package-v0.1"));
test("LLM embedded sources cannot substitute for the user's Source Store", () => {
  const preview = previewImport(json);
  assert.equal(preview.package, null);
  assert.ok(preview.errors.length > 0);
  assert.throws(() => importPackage(json));
});
test("forged source with the same ID is rejected instead of silently replaced", () => {
  const forged = JSON.parse(json);
  forged.sources[0].chunks[0].text += ' Made-up information.';
  assert.equal(previewImport(JSON.stringify(forged), trustedSources).package, null);
});
test("unrelated saved sources do not replace the package's declared sources", () => {
  const unrelated = structuredClone(trustedSources[0]); unrelated.sourceId = 'other';
  const preview = previewImport(json, [...trustedSources, unrelated]);
  assert.equal(preview.sources, 1);
  assert.equal(preview.package?.sources.length, 1);
});
