import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  isWithdrawInProgress,
  sumAmounts,
  withdrawStatusLabelKey,
  withdrawStatusTone,
} from './withdrawStatus';

describe('withdrawStatus', () => {
  it('maps every status to a tone', () => {
    assert.equal(withdrawStatusTone('concluded'), 'ok');
    assert.equal(withdrawStatusTone('failed'), 'bad');
    assert.equal(withdrawStatusTone('refused'), 'bad');
    assert.equal(withdrawStatusTone('pending'), 'warn');
    assert.equal(withdrawStatusTone('escrowing_resources'), 'warn');
    assert.equal(withdrawStatusTone('ready_to_transfer_funds'), 'warn');
    assert.equal(withdrawStatusTone(undefined), 'grey');
  });

  it('keeps the three in-progress states under the same "pending" label', () => {
    for (const s of ['pending', 'escrowing_resources', 'ready_to_transfer_funds']) {
      assert.equal(withdrawStatusLabelKey(s), 'auth>withdrawStatus>pending');
      assert.ok(isWithdrawInProgress(s));
    }
    assert.equal(isWithdrawInProgress('concluded'), false);
    assert.equal(withdrawStatusLabelKey('refused'), 'auth>withdrawStatus>refused');
  });

  it('sums amounts and skips garbage', () => {
    assert.equal(
      sumAmounts([{ amount: '120.00' }, { amount: '217' }, { amount: 'x' }, { amount: null }, {}]),
      337
    );
    assert.equal(sumAmounts([]), 0);
  });
});
