import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getSafeRedirectUrl } from './safeRedirectUrl';

const origin = 'https://app.zuca.ai';

describe('getSafeRedirectUrl', () => {
  it('keeps same-origin paths untouched', () => {
    assert.equal(getSafeRedirectUrl('/wallet', origin), '/wallet');
    assert.equal(
      getSafeRedirectUrl('/auth/signIn?callbackPath=%2Fwallet', origin),
      '/auth/signIn?callbackPath=%2Fwallet'
    );
  });

  it('accepts absolute http(s) URLs', () => {
    assert.equal(
      getSafeRedirectUrl('https://example.com/promo', origin),
      'https://example.com/promo'
    );
    assert.equal(
      getSafeRedirectUrl('http://example.com', origin),
      'http://example.com/'
    );
  });

  it('resolves protocol-relative and bare values against the origin', () => {
    assert.equal(
      getSafeRedirectUrl('//example.com/x', origin),
      'https://example.com/x'
    );
    assert.equal(
      getSafeRedirectUrl('promo', origin),
      'https://app.zuca.ai/promo'
    );
  });

  it('rejects javascript:, data: and other schemes', () => {
    assert.equal(getSafeRedirectUrl('javascript:alert(1)', origin), null);
    assert.equal(getSafeRedirectUrl('JavaScript:alert(1)', origin), null);
    assert.equal(
      getSafeRedirectUrl('data:text/html,<script>alert(1)</script>', origin),
      null
    );
    assert.equal(getSafeRedirectUrl('vbscript:msgbox', origin), null);
    assert.equal(getSafeRedirectUrl('  javascript:alert(1)', origin), null);
  });

  it('returns null for empty or non-string input', () => {
    assert.equal(getSafeRedirectUrl('', origin), null);
    assert.equal(getSafeRedirectUrl('   ', origin), null);
    assert.equal(getSafeRedirectUrl(undefined, origin), null);
    assert.equal(getSafeRedirectUrl(null, origin), null);
  });
});
