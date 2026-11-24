import { PixwayAppRoutes } from '../enums/PixwayAppRoutes';

type SignOutFn = (payload?: { callbackUrl?: string }) => Promise<unknown>;

let signOutInFlight = false;

/**
 * Builds the sign-in URL the user is sent back to after an expired session
 * is cleared. Always a same-origin path: next-auth resolves it against its
 * own base URL, and the host app's `redirect` callback never sees an
 * absolute URL it cannot parse.
 */
export const buildExpiredSessionCallbackUrl = (currentHref?: string) => {
  const params = new URLSearchParams();
  if (currentHref) params.set('callbackUrl', currentHref);
  const query = params.toString();
  return query ? `${PixwayAppRoutes.SIGN_IN}?${query}` : PixwayAppRoutes.SIGN_IN;
};

/**
 * Signs the user out once when the access token is expired and the session
 * could not be refreshed. Many hooks detect the expired token at the same
 * time (every `useAxios` on the page), so the call is deduplicated here: the
 * first caller wins, later ones are no-ops until that attempt settles.
 */
export const signOutExpiredSession = (signOut: SignOutFn) => {
  if (signOutInFlight) return;
  signOutInFlight = true;
  const href = typeof window !== 'undefined' ? window.location.href : undefined;
  Promise.resolve(signOut({ callbackUrl: buildExpiredSessionCallbackUrl(href) }))
    .catch(() => undefined)
    .finally(() => {
      // Keep the guard for a moment so a failed sign-out does not turn into a
      // request storm; the next render after that may try again.
      setTimeout(() => {
        signOutInFlight = false;
      }, 5000);
    });
};

/** Test hook: clears the dedupe guard. */
export const resetExpiredSessionSignOut = () => {
  signOutInFlight = false;
};
