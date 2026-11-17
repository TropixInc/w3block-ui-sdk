import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { contextStatusLabelKey, contextStatusTone } from './contextStatus';

describe('contextStatus', () => {
  it('maps the five known statuses', () => {
    assert.equal(contextStatusTone('approved'), 'ok');
    assert.equal(contextStatusTone('denied'), 'bad');
    assert.equal(contextStatusTone('requiredReview'), 'warn');
    assert.equal(contextStatusTone('created'), 'info');
    assert.equal(contextStatusTone('draft'), 'grey');
    assert.equal(contextStatusLabelKey('draft'), 'shared>contextStatus>draft');
  });

  it('degrades gracefully on unknown values', () => {
    assert.equal(contextStatusTone('whatever'), 'grey');
    assert.equal(contextStatusTone(undefined), 'grey');
    assert.equal(contextStatusLabelKey(undefined), 'shared>contextStatus>unknown');
  });
});
