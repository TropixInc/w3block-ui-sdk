import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  formatPoints,
  isReleased,
  mockSettlementFor,
  resolveSettlement,
} from './settlement';

const DAY = 24 * 60 * 60 * 1000;
const daysAgo = (days: number) => new Date(Date.now() - days * DAY);
const iso = (date: Date) => date.toISOString();

describe('isReleased', () => {
  it('is false without a date or with garbage', () => {
    assert.equal(isReleased(undefined), false);
    assert.equal(isReleased(null), false);
    assert.equal(isReleased('not-a-date'), false);
  });
  it('is true at or before now and false in the future', () => {
    assert.equal(isReleased(iso(daysAgo(1))), true);
    assert.equal(isReleased(iso(daysAgo(-1))), false);
  });
});

describe('formatPoints', () => {
  it('returns a dash for empty values', () => {
    assert.equal(formatPoints(undefined), '—');
    assert.equal(formatPoints(null), '—');
    assert.equal(formatPoints('abc'), '—');
  });
  it('formats decimals and integers per locale', () => {
    assert.equal(formatPoints('1234.5', 'decimal', 'pt-BR'), '1.234,50');
    assert.equal(formatPoints(1234.5, 'decimal', 'en'), '1,234.50');
    assert.equal(formatPoints(1234.5, 'integer', 'en'), '1,235');
  });
});

describe('mockSettlementFor', () => {
  it('is pending without a release date', () => {
    assert.deepEqual(mockSettlementFor('a', null), {
      settlement: 'pending',
      withdrawId: null,
      withdrawPaidAt: null,
    });
    assert.equal(mockSettlementFor('a', 'garbage').settlement, 'pending');
  });
  it('is paid when the following Friday is well in the past', () => {
    const result = mockSettlementFor('abc', iso(daysAgo(30)));
    assert.equal(result.settlement, 'paid');
    assert.match(result.withdrawId as string, /^mock-[0-9a-f]+$/);
    assert.ok(result.withdrawPaidAt);
    assert.equal(new Date(result.withdrawPaidAt as string).getDay(), 5);
  });
  it('is pending when released in the future', () => {
    assert.equal(
      mockSettlementFor('abc', iso(daysAgo(-3))).settlement,
      'pending'
    );
  });
  it('is deterministic per id', () => {
    const a = mockSettlementFor('same-id', iso(daysAgo(30)));
    const b = mockSettlementFor('same-id', iso(daysAgo(30)));
    assert.deepEqual(a, b);
    assert.notEqual(
      mockSettlementFor('other-id', iso(daysAgo(30))).withdrawId,
      a.withdrawId
    );
  });
});

describe('resolveSettlement', () => {
  it('locks rows that have not been released yet, regardless of the API', () => {
    const result = resolveSettlement({
      id: 'x',
      item: {
        settlement: 'paid',
        withdrawId: 'w1',
        withdrawPaidAt: iso(daysAgo(1)),
      },
      released: false,
      releasedAt: iso(daysAgo(-5)),
    });
    assert.deepEqual(result, { key: 'locked', color: 'gray', isMock: false });
  });
  it('prefers the API fields and is not flagged as mock', () => {
    const paidAt = iso(daysAgo(2));
    const result = resolveSettlement({
      id: 'x',
      item: { settlement: 'paid', withdrawId: 'w1', withdrawPaidAt: paidAt },
      released: true,
      releasedAt: iso(daysAgo(9)),
    });
    assert.equal(result?.key, 'paid');
    assert.equal(result?.color, 'green');
    assert.equal(result?.paidAt, paidAt);
    assert.equal(result?.withdrawId, 'w1');
    assert.equal(result?.isMock, false);
  });
  it('maps every API status to a pill', () => {
    const base = { id: 'x', released: true, releasedAt: iso(daysAgo(9)) };
    assert.equal(
      resolveSettlement({ ...base, item: { settlement: 'in_withdraw' } })
        ?.color,
      'blue'
    );
    assert.equal(
      resolveSettlement({ ...base, item: { settlement: 'refused' } })?.color,
      'red'
    );
    assert.equal(
      resolveSettlement({ ...base, item: { settlement: 'pending' } })?.color,
      'amber'
    );
  });
  it('falls back to the simulation and flags it when the API has no settlement', () => {
    const result = resolveSettlement({
      id: 'x',
      item: {},
      released: true,
      releasedAt: iso(daysAgo(30)),
    });
    assert.equal(result?.isMock, true);
    assert.equal(result?.key, 'paid');
  });
});
