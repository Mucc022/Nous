import assert from "node:assert/strict";
import test from "node:test";
import { chunkSourceText, createSourceDocument, normalizeSourceText, sha256Hex } from "../app/domain/source-store";

test('long paragraphs respect the chunk limit without splitting Unicode pairs', () => {
  const text = 'a'.repeat(11) + '😀' + 'b'.repeat(13);
  const chunks = chunkSourceText(text, 6);
  assert.equal(chunks.map(chunk => chunk.text).join(''), text);
  assert.ok(chunks.every(chunk => chunk.text.length <= 6 && !/[\uD800-\uDBFF]$/.test(chunk.text)));
});

test("normalizes line endings and BOM", () => assert.equal(normalizeSourceText("\uFEFFa\r\nb\r"), "a\nb"));
test("produces a stable SHA-256 identity", async () => assert.equal(await sha256Hex("abc"), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"));
test("chunks source deterministically and preserves exact text", () => {
  const chunks = chunkSourceText("One\n\nTwo\n\nThree", 7);
  assert.deepEqual(chunks.map((chunk) => chunk.chunkId), ["chunk_0001", "chunk_0002", "chunk_0003"]);
  assert.equal(chunks.map((chunk) => chunk.text).join("\n\n"), "One\n\nTwo\n\nThree");
});
test("creates a source document with stable chunks", async () => {
  const source = await createSourceDocument("src_1", " Notes ", "A\r\n\r\nB", 100);
  assert.equal(source.title, "Notes"); assert.equal(source.chunks[0].text, "A\n\nB"); assert.equal(source.sha256, await sha256Hex("A\n\nB"));
});
