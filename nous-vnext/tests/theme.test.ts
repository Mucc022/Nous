import test from 'node:test';
import assert from 'node:assert/strict';
import { accentPalette } from '../app/domain/theme';
test('palette derives distinct light and dark colors and selects readable foreground', () => {
  assert.equal(accentPalette('#ffffff').onMain, '#151515');
  assert.equal(accentPalette('#000000').onMain, '#ffffff');
  const palette = accentPalette('#FF0000');
  assert.equal(palette.main, '#ff0000');
  assert.equal(palette.soft, '#ffe6e6');
  assert.equal(palette.dark, '#5c0000');
  assert.throws(() => accentPalette('red'));
});
