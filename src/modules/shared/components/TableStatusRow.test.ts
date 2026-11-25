import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { TableStatusRow } from './TableStatusRow';

test('renders the status inside tbody > tr > td, never a div straight under table', () => {
  const html = renderToStaticMarkup(
    createElement(
      'table',
      null,
      createElement(
        TableStatusRow,
        { colSpan: 3, className: 'pw-h-20' },
        'empty'
      )
    )
  );
  assert.match(
    html,
    /^<table><tbody><tr><td colspan="3"[^>]*><div class="pw-h-20">empty<\/div><\/td><\/tr><\/tbody><\/table>$/i
  );
});
