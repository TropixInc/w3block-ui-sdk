import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  isWithdrawAwaitingAction,
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

  it('keeps the four in-progress states under the same user label', () => {
    for (const s of [
      'pending',
      'escrowing_resources',
      'ready_to_transfer_funds',
      'transferring_funds',
    ]) {
      assert.equal(withdrawStatusLabelKey(s), 'auth>withdrawStatus>inProgress');
      assert.ok(isWithdrawInProgress(s));
    }
    assert.equal(isWithdrawInProgress('concluded'), false);
    assert.equal(
      withdrawStatusLabelKey('refused'),
      'auth>withdrawStatus>refused'
    );
  });

  it('tells the admin which steps wait for them', () => {
    assert.equal(
      withdrawStatusLabelKey('pending', 'admin'),
      'auth>withdrawStatus>awaitingAction'
    );
    assert.equal(
      withdrawStatusLabelKey('ready_to_transfer_funds', 'admin'),
      'auth>withdrawStatus>awaitingAction'
    );
    assert.equal(
      withdrawStatusLabelKey('escrowing_resources', 'admin'),
      'auth>withdrawStatus>escrowingResources'
    );
    assert.equal(
      withdrawStatusLabelKey('transferring_funds', 'admin'),
      'auth>withdrawStatus>transferringFunds'
    );
    assert.ok(isWithdrawAwaitingAction('pending'));
    assert.ok(isWithdrawAwaitingAction('ready_to_transfer_funds'));
    assert.equal(isWithdrawAwaitingAction('escrowing_resources'), false);
    assert.equal(isWithdrawAwaitingAction('concluded'), false);
  });

  it('sums amounts and skips garbage', () => {
    assert.equal(
      sumAmounts([
        { amount: '120.00' },
        { amount: '217' },
        { amount: 'x' },
        { amount: null },
        {},
      ]),
      337
    );
    assert.equal(sumAmounts([]), 0);
  });
});
