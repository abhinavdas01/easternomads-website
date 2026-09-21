import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeTheme, themeCss, contrast, presets } from './themeModel.ts';

test('saved themes reject unknown selectors, injected CSS and invalid bounds', () => {
  const clean = sanitizeTheme({ global: { '--brand': '#123456', '--ink': '#fff; } body { display:none', '--max': '99999px', '--font-body': 'url(https://example.com)', '--unknown': '#123456' }, 'body{}': { '--brand': '#123456' }, services: { '--brand': '#654321' } });
  assert.deepEqual(clean, { global: { '--brand': '#123456' }, services: { '--brand': '#654321' } });
  assert.deepEqual(sanitizeTheme(null), {});
  assert.deepEqual(sanitizeTheme([]), {});
});
test('exports global and section overrides without baking inherited values into sections', () => {
  const css = themeCss({ global: { '--brand': '#123456', '--radius': '8px' }, contact: { '--section-bg': '#ffffff' } });
  assert.match(css, /:root \{\n  --brand: #123456;/);
  assert.match(css, /\[data-theme-section="contact"\] \{\n  --section-bg: #ffffff;/);
  assert.equal(themeCss({}), '');
  for (const preset of presets) assert.deepEqual(sanitizeTheme({ global: preset.tokens }), Object.keys(preset.tokens).length ? { global: preset.tokens } : {});
});
test('contrast checker catches the existing orange button and handles extreme pairs', () => {
  assert.ok(Math.abs(contrast('#ffffff', '#e85a17') - 3.5557) < 0.001);
  assert.equal(contrast('#ffffff', '#000000'), 21);
  assert.equal(contrast('#ffffff', '#ffffff'), 1);
});
