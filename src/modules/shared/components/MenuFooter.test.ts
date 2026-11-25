import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { MenuFooter } from './MenuFooter';

test('renders the member-since line once the profile date is known', () => {
  const html = renderToStaticMarkup(
    createElement(MenuFooter, {
      memberSince: '09/11/2024',
      label: 'Membro desde',
    })
  );
  assert.match(html, /Membro desde 09\/11\/2024/);
  assert.ok(!/pw-animate-pulse/.test(html));
});

test('shows a skeleton while the profile loads', () => {
  const html = renderToStaticMarkup(
    createElement(MenuFooter, { label: 'Membro desde' })
  );
  assert.match(html, /pw-animate-pulse/);
});

test('never wraps block content in a <p> (invalid nesting breaks hydration)', () => {
  const cases: { label: string; memberSince?: string }[] = [
    { label: 'x' },
    { label: 'x', memberSince: '01/01/2025' },
  ];
  for (const props of cases) {
    const html = renderToStaticMarkup(createElement(MenuFooter, props));
    assert.ok(!/<p[\s>]/.test(html), html);
  }
});
