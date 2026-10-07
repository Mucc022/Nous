import assert from 'node:assert/strict';
import test from 'node:test';
import { readSourceFile } from '../app/domain/source-file';

test('txt and markdown files produce original text and filename title', async () => {
  for (const name of ['Notes.txt', 'Notes.MD']) {
    assert.deepEqual(await readSourceFile(new File(['a\r\nb'], name)), { title: name, text: 'a\r\nb' });
  }
});
test('classroom SRT subtitles preserve timestamps and original wording for provenance', async () => {
  const text = '1\r\n00:00:01,920 --> 00:00:09,040\r\n今天會上課\r\n';
  assert.deepEqual(await readSourceFile(new File([text], 'class.SRT')), { title: 'class.SRT', text });
});
test('unsupported files and empty text are rejected', async () => {
  await assert.rejects(readSourceFile(new File(['data'], 'notes.pdf')), /txt|md/);
  await assert.rejects(readSourceFile(new File(['  '], 'notes.txt')), /空/);
});
test('oversized originals are rejected before processing', async () => {
  const file = new File([new Uint8Array(2 * 1024 * 1024 + 1)], 'large.txt');
  await assert.rejects(readSourceFile(file), /2 MB/);
});
test('invalid UTF-8 does not silently replace original bytes with replacement characters', async () => {
  await assert.rejects(readSourceFile(new File([new Uint8Array([0xc3, 0x28])], 'invalid.md')));
});
