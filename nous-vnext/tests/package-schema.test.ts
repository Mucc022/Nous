import assert from 'node:assert/strict';
import test from 'node:test';
import Ajv2020 from 'ajv/dist/2020.js';
import schema from '../schema/nous-package-v0.1.schema.json';
import fixture from '../fixtures/valid-package.json';

test('exported schema enforces choice structure without application validator', () => {
  const validate = new Ajv2020({ strict: false }).compile(schema);
  const p = structuredClone(fixture);
  const q = p.cards[0].questions[0] as Record<string, unknown>;
  q.type = 'single_choice'; q.answer = 'a';
  assert.equal(validate(p), false);
  q.choices = ['a', 'b'];
  assert.equal(validate(p), true);
  q.answer = ['a', 'b'];
  assert.equal(validate(p), false);
  q.type = 'multiple_choice';
  assert.equal(validate(p), true);
  q.answer = 'a';
  assert.equal(validate(p), false);
});
