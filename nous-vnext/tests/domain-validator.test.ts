import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { validateNousPackage } from "../app/domain/validator";

test('malformed collection types return validation issues without throwing', () => {
  for (const value of [{ sources: {}, cards: {} }, { sources: 'invalid', cards: 7 }, { sources: [null], cards: [null] }]) {
    const result = validateNousPackage(value);
    assert.equal(result.valid, false);
    assert.ok(result.errors.length > 0);
  }
});

const valid = JSON.parse(readFileSync(new URL("../fixtures/valid-package.json", import.meta.url), "utf8"));

test('choice question requires options and answers drawn from those options', () => {
  const p = structuredClone(valid);
  const q = p.cards[0].questions[0];
  Object.assign(q, { type: 'single_choice', answer: 'a' });
  assert.equal(validateNousPackage(p).valid, false);
  q.choices = ['a', 'b'];
  assert.equal(validateNousPackage(p).valid, true);
  q.answer = 'absent';
  assert.equal(validateNousPackage(p).valid, false);
  Object.assign(q, { type: 'multiple_choice', answer: ['a', 'b'] });
  assert.equal(validateNousPackage(p).valid, true);
  q.answer = ['a', 'a'];
  assert.equal(validateNousPackage(p).valid, false);
});

test('fill blank requires one answer for each visible blank', () => {
  const p = structuredClone(valid);
  Object.assign(p.cards[0].questions[0], { type: 'fill_blank', prompt: '{{first}} and {{second}}', answer: ['one'] });
  assert.equal(validateNousPackage(p).valid, false);
  p.cards[0].questions[0].answer = ['one', 'two'];
  assert.equal(validateNousPackage(p).valid, true);
});
test('true false cannot import an ungradable answer', () => {
  const p = structuredClone(valid);
  Object.assign(p.cards[0].questions[0], { type: 'true_false', answer: 'maybe' });
  assert.equal(validateNousPackage(p).valid, false);
});

test('duplicate identifiers cannot merge unrelated learning identities', () => {
  const mutations = [
    (p: typeof valid) => p.cards.push(structuredClone(p.cards[0])),
    (p: typeof valid) => p.cards[0].questions.push(structuredClone(p.cards[0].questions[0])),
    (p: typeof valid) => p.sources.push(structuredClone(p.sources[0])),
    (p: typeof valid) => p.sources[0].chunks.push(structuredClone(p.sources[0].chunks[0])),
  ];
  for (const mutate of mutations) {
    const p = structuredClone(valid); mutate(p);
    assert.equal(validateNousPackage(p).valid, false);
  }
});

test("accepts a valid source-linked package", () => {
  assert.equal(validateNousPackage(valid).valid, true);
});

test("rejects a missing cardId", () => {
  const value = structuredClone(valid); delete value.cards[0].cardId;
  const result = validateNousPackage(value);
  assert.equal(result.valid, false); assert.match(result.errors.map((e) => e.message).join(" "), /cardId/);
});

test("rejects an unknown question type", () => {
  const value = structuredClone(valid); value.cards[0].questions[0].type = "matching";
  assert.equal(validateNousPackage(value).valid, false);
});

test("rejects a multiple choice answer that is not an array", () => {
  const value = structuredClone(valid); value.cards[0].questions[0].type = "multiple_choice";
  assert.equal(validateNousPackage(value).valid, false);
});

test("rejects a missing source reference", () => {
  const value = structuredClone(valid); value.cards[0].questions[0].sourceRefs = [];
  assert.equal(validateNousPackage(value).valid, false);
});

test("rejects a quote that is absent from its chunk", () => {
  const value = structuredClone(valid); value.cards[0].questions[0].sourceRefs[0].quote = "invented";
  assert.equal(validateNousPackage(value).valid, false);
});

test("rejects schema-level unknown package properties", () => {
  const value = structuredClone(valid); value.unexpected = true;
  assert.equal(validateNousPackage(value).valid, false);
});

test("rejects schema-level malformed source chunks", () => {
  const value = structuredClone(valid); delete value.sources[0].chunks[0].index;
  assert.equal(validateNousPackage(value).valid, false);
});
