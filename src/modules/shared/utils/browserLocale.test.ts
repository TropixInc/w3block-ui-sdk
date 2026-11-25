import assert from 'node:assert/strict';
import { test } from 'node:test';

import { I18NLocaleEnum } from '@w3block/sdk-id';

import { detectBrowserLocale } from './browserLocale';

test('pt-BR browsers get the Portuguese locale, anything else English', () => {
  assert.equal(detectBrowserLocale('pt-BR'), I18NLocaleEnum.PtBr);
  assert.equal(detectBrowserLocale('en-US'), I18NLocaleEnum.En);
  assert.equal(detectBrowserLocale('es'), I18NLocaleEnum.En);
});

test('without a browser (server render) it falls back to pt-BR and does not throw', () => {
  assert.equal(typeof navigator, 'undefined');
  assert.equal(detectBrowserLocale(), I18NLocaleEnum.PtBr);
});
