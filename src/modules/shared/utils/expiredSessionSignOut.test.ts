import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  buildExpiredSessionCallbackUrl,
  resetExpiredSessionSignOut,
  signOutExpiredSession,
} from './expiredSessionSignOut';

describe('buildExpiredSessionCallbackUrl', () => {
  it('returns a same-origin sign-in path with the current page encoded', () => {
    assert.equal(
      buildExpiredSessionCallbackUrl('https://app.zuca.ai/wallet?page=1'),
      '/auth/signIn?callbackUrl=https%3A%2F%2Fapp.zuca.ai%2Fwallet%3Fpage%3D1'
    );
  });

  it('returns the bare sign-in path without a current page', () => {
    assert.equal(buildExpiredSessionCallbackUrl(undefined), '/auth/signIn');
  });
});

describe('signOutExpiredSession', () => {
  it('calls signOut once even when many hooks detect the expiry together', async () => {
    resetExpiredSessionSignOut();
    let calls = 0;
    const signOut = async () => {
      calls += 1;
    };
    signOutExpiredSession(signOut);
    signOutExpiredSession(signOut);
    signOutExpiredSession(signOut);
    await Promise.resolve();
    assert.equal(calls, 1);
  });

  it('passes a relative callback url', async () => {
    resetExpiredSessionSignOut();
    let received: { callbackUrl?: string } | undefined;
    const signOut = async (payload?: { callbackUrl?: string }) => {
      received = payload;
    };
    signOutExpiredSession(signOut);
    await Promise.resolve();
    assert.ok(received?.callbackUrl?.startsWith('/auth/signIn'));
  });

  it('does not throw when signOut rejects', async () => {
    resetExpiredSessionSignOut();
    const signOut = async () => {
      throw new Error('500');
    };
    let threw = false;
    try {
      signOutExpiredSession(signOut);
    } catch {
      threw = true;
    }
    await new Promise((r) => setTimeout(r, 0));
    assert.equal(threw, false);
  });
});
