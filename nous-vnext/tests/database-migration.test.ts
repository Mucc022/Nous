import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import test from 'node:test';

test('migration creates queryable tables and enforces one state per user/question', () => {
  const db = new DatabaseSync(':memory:');
  try {
    db.exec(readFileSync(new URL('../drizzle/0000_whole_alex_power.sql', import.meta.url), 'utf8'));
    for (const table of ['sources', 'content_packages', 'learning_states', 'review_events']) {
      assert.equal(db.prepare(`SELECT count(*) AS n FROM ${table}`).get()?.n, 0);
    }
    const insert = db.prepare('INSERT INTO learning_states (id,user_id,question_id,phase) VALUES (?,?,?,?)');
    insert.run('a:q', 'a', 'q', 'new');
    insert.run('b:q', 'b', 'q', 'review');
    assert.throws(() => insert.run('duplicate', 'a', 'q', 'review'), /UNIQUE/);
    assert.equal(db.prepare('SELECT phase FROM learning_states WHERE user_id=? AND question_id=?').get('a', 'q')?.phase, 'new');
    assert.equal(db.prepare('SELECT phase FROM learning_states WHERE user_id=? AND question_id=?').get('b', 'q')?.phase, 'review');
  } finally { db.close(); }
});
