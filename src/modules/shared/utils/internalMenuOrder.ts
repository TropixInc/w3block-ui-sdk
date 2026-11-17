/**
 * Fixed order of the internal (logged-in area) menu.
 *
 * Both menu renderings (the side menu in `Menu.tsx` and the avatar dropdown in
 * `NavigationLoginLoggedButton*.tsx`) must show the same items in the same
 * order; visibility rules stay per item, this only decides the position.
 * Items whose id is not listed here keep their relative order and go last.
 */
export const INTERNAL_MENU_ORDER: readonly string[] = [
  'wallet',
  'extract',
  'futureStatement',
  'withdraws',
  'pass',
  'myOrders',
  'cards',
  'affiliates',
  'staking',
  'mySales',
  'notifications',
  'integration',
  'myProfile',
  // admin / operator items at the end
  'withdrawsAdmin',
  'dash',
  'payment',
  'requests',
  'clients',
];

export function sortInternalMenuTabs<T extends { id?: string }>(
  tabs: readonly T[]
): T[] {
  const rank = (tab: T) => {
    const i = tab.id ? INTERNAL_MENU_ORDER.indexOf(tab.id) : -1;
    return i === -1 ? INTERNAL_MENU_ORDER.length : i;
  };
  return tabs
    .map((tab, index) => ({ tab, index }))
    .sort((a, b) => rank(a.tab) - rank(b.tab) || a.index - b.index)
    .map(({ tab }) => tab);
}
