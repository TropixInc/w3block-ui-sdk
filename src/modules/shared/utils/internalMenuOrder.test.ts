import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { INTERNAL_MENU_ORDER, sortInternalMenuTabs } from './internalMenuOrder';

describe('sortInternalMenuTabs', () => {
  it('orders by the fixed list regardless of input order', () => {
    const input = [
      { id: 'myProfile' },
      { id: 'payment' },
      { id: 'wallet' },
      { id: 'extract' },
      { id: 'withdrawsAdmin' },
    ];
    assert.deepEqual(
      sortInternalMenuTabs(input).map((t) => t.id),
      ['wallet', 'extract', 'myProfile', 'withdrawsAdmin', 'payment']
    );
  });

  it('keeps unknown ids last, in their original relative order', () => {
    const input = [{ id: 'zzz' }, { id: 'wallet' }, { id: 'aaa' }, {}];
    assert.deepEqual(
      sortInternalMenuTabs(input).map((t) => t.id ?? '(none)'),
      ['wallet', 'zzz', 'aaa', '(none)']
    );
  });

  it('is stable for items that share a rank', () => {
    const input = [{ id: 'x', n: 1 }, { id: 'x', n: 2 }, { id: 'x', n: 3 }];
    assert.deepEqual(
      sortInternalMenuTabs(input).map((t) => t.n),
      [1, 2, 3]
    );
  });

  it('does not mutate the input', () => {
    const input = [{ id: 'payment' }, { id: 'wallet' }];
    const copy = [...input];
    sortInternalMenuTabs(input);
    assert.deepEqual(input, copy);
  });

  it('puts user items before admin items', () => {
    const user = INTERNAL_MENU_ORDER.indexOf('myProfile');
    const admin = INTERNAL_MENU_ORDER.indexOf('withdrawsAdmin');
    assert.ok(user < admin);
    assert.equal(INTERNAL_MENU_ORDER[0], 'wallet');
  });
});
