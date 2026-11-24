import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  getErrorStatus,
  isClientError,
  sdkQueryDefaults,
  shouldRetryQuery,
} from './queryDefaults';

test('reads the status from axios-like and fetch-like errors', () => {
  assert.equal(getErrorStatus({ response: { status: 404 } }), 404);
  assert.equal(getErrorStatus({ status: 500 }), 500);
  assert.equal(getErrorStatus(new Error('boom')), undefined);
  assert.equal(getErrorStatus(null), undefined);
  assert.equal(getErrorStatus('x'), undefined);
});

test('4xx is a client error, everything else is not', () => {
  assert.equal(isClientError({ response: { status: 400 } }), true);
  assert.equal(isClientError({ response: { status: 499 } }), true);
  assert.equal(isClientError({ response: { status: 500 } }), false);
  assert.equal(isClientError({ response: { status: 399 } }), false);
  assert.equal(isClientError(new Error('network')), false);
});

test('retries once for network/5xx errors and never for 4xx', () => {
  assert.equal(shouldRetryQuery(0, new Error('network')), true);
  assert.equal(shouldRetryQuery(1, new Error('network')), false);
  assert.equal(shouldRetryQuery(0, { response: { status: 503 } }), true);
  assert.equal(shouldRetryQuery(0, { response: { status: 404 } }), false);
  assert.equal(shouldRetryQuery(0, { response: { status: 401 } }), false);
});

test('defaults disable refetch on focus and keep data fresh for a minute', () => {
  assert.equal(sdkQueryDefaults.queries.refetchOnWindowFocus, false);
  assert.equal(sdkQueryDefaults.queries.staleTime, 60_000);
  assert.equal(sdkQueryDefaults.queries.retry, shouldRetryQuery);
});
