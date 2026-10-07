import assert from 'node:assert/strict';
import test from 'node:test';
import { createSourceDocument } from '../app/domain/source-store';
import { importPackage } from '../app/domain/import-pipeline';
import { gradeResponse } from '../app/domain/answer-grading';

test('all seven types import against a saved source and retain gradeable answers', async () => {
  const source = await createSourceDocument('source_test', 'Synthetic acceptance notes', 'Retrieval means recalling information. Spaced practice distributes learning over time.');
  const refs = [{ sourceId: source.sourceId, chunkId: source.chunks[0].chunkId, quote: 'Retrieval means recalling information.' }];
  const questions = [
    { questionId: 'single', type: 'single_choice', prompt: 'Which is retrieval?', choices: ['recalling', 'copying'], answer: 'recalling', sourceRefs: refs },
    { questionId: 'multi', type: 'multiple_choice', prompt: 'Select the stated concepts.', choices: ['retrieval', 'spaced practice', 'cramming'], answer: ['retrieval', 'spaced practice'], sourceRefs: refs },
    { questionId: 'boolean', type: 'true_false', prompt: 'Retrieval means recalling information.', answer: 'true', sourceRefs: refs },
    { questionId: 'blank', type: 'fill_blank', prompt: '{{a}} means {{b}} information.', answer: ['Retrieval', 'recalling'], sourceRefs: refs },
    { questionId: 'short', type: 'short_answer', prompt: 'Define retrieval.', answer: 'Recalling information.', sourceRefs: refs },
    { questionId: 'explain', type: 'explanation', prompt: 'Explain spaced practice.', answer: 'Distributing learning over time.', sourceRefs: refs },
    { questionId: 'analysis', type: 'analysis', prompt: 'Contrast recalling and distributing practice.', answer: 'Retrieval describes recall; spacing describes timing.', sourceRefs: refs },
  ];
  const result = importPackage(JSON.stringify({ format: 'nous-package-v0.1', contentVersion: '0.1.0', title: 'Synthetic tests only', sources: [source], cards: [{ cardId: 'c', title: 'Learning concepts', questions }] }), [source]);
  assert.equal(result.cards[0].questions.length, 7);
  const outcomes = result.cards[0].questions.map(q => gradeResponse(q.type, q.answer, q.answer));
  assert.deepEqual(outcomes, [true, true, true, true, null, null, null]);
  assert.deepEqual(result.cards[0].questions[0].choices, ['recalling', 'copying']);
});
