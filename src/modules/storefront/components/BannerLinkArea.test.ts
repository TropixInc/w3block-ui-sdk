import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { BannerLinkArea } from './BannerLinkArea';

const child = createElement('a', { href: '/cta' }, 'Saiba mais');

test('with a link it is a focusable link-like block, never an <a> around the CTA', () => {
  const html = renderToStaticMarkup(
    createElement(BannerLinkArea, { href: '/promo' }, child)
  );
  assert.match(html, /role="link"/);
  assert.match(html, /tabindex="0"/i);
  assert.match(html, /pw-cursor-pointer/);
  // the only anchor in the output is the CTA itself
  assert.equal((html.match(/<a[\s>]/g) ?? []).length, 1);
  assert.match(html, /href="\/cta"/);
});

test('without a link it is a plain block', () => {
  const html = renderToStaticMarkup(
    createElement(BannerLinkArea, { href: undefined }, child)
  );
  assert.ok(!/role="link"/.test(html), html);
  assert.ok(!/tabindex/i.test(html), html);
  assert.equal((html.match(/<a[\s>]/g) ?? []).length, 1);
});
