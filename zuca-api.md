# Routes reference (`src/modules/shared/routes.ts`)

This document explains how route builders in `routes.ts` are used in the app and how they map to W3Block services.

## Source of truth

- Route builders: `src/modules/shared/routes.ts`
- Environment variables: `src/env.ts`
  - `EXPO_PUBLIC_WEBLOCK_ID_HOST` → `WEBLOCK_ID_HOST`
  - `EXPO_PUBLIC_WEBLOCK_COMMERCE_HOST` → `WEBLOCK_COMMERCE_HOST`
  - `EXPO_PUBLIC_WEBLOCK_KEY_HOST` → `WEBLOCK_KEY_HOST`
  - `EXPO_PUBLIC_CMS_HOST` → `CMS_HOST`
  - `EXPO_PUBLIC_TENANT_ID` → `TENANT_ID`
  - `EXPO_PUBLIC_ZUCA_LOYALTY_ID` → `ZUCA_LOYALTY_ID`
  - `EXPO_PUBLIC_ZUCA_CONTRACT_ID` → `ZUCA_CONTRACT_ID`

## External documentation (Swagger / architecture)

- **Identity service (Pixway ID)** (`WEBLOCK_ID_HOST`): https://pixwayid.w3block.io/docs/
- **Commerce service** (`WEBLOCK_COMMERCE_HOST`): https://commerce.w3block.io/docs/
- **Key / token-loyalty service** (`WEBLOCK_KEY_HOST`): https://api.w3block.io/docs/
- **Platform architecture overview**: https://w3block.gitbook.io/w3block-eng

## How the services connect in this app

At runtime, this app orchestrates three backend domains:

1. **Identity / user lifecycle** (`WEBLOCK_ID_HOST`)
   - sign-in, sign-up, profile, phone verification, user documents, affiliations
2. **Commerce** (`WEBLOCK_COMMERCE_HOST`)
   - order preview/creation/history, credit cards, order usage stats
3. **Key / loyalty / token history** (`WEBLOCK_KEY_HOST`)
   - ZUCA balance, ERC-20 history, multilevel cashback reports

The common flow is:

- Authenticate in **ID** (`/auth/*`) and store JWT/refresh token
- Use JWT in protected calls (`useAuthAxios`) across ID + Commerce + Key routes
- Build purchase and payment journey in **Commerce**
- Enrich wallet/statement/network data in **Key** and **ID**

## Auth and HTTP client conventions

- `axios` is used for public/initial endpoints (sign-in, sign-up, reset password, etc.)
- `useAuthAxios()` is used for authenticated endpoints; it injects:
  - `Authorization: Bearer <jwt>`
  - `Content-Type: application/json`

See `src/modules/shared/hooks/useAuthAxios.ts` for current implementation.

## Route catalog

> `Method` reflects current app usage (how route builders are called today).

### ID service (`WEBLOCK_ID_HOST`)

| Route key                        | Method  | Path template                                                                        | App behavior (params sent, response used, UI impact)                                                                                                                                                                  |
| -------------------------------- | ------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `SIGN_IN`                        | `POST`  | `/auth/signin`                                                                       | Sends `{ tenantId, email, password }`; consumes `token`, `refreshToken`, and `data/profile` (`name`, `sub`, `roles`, `verified`, `phone`, `phoneVerified`) and stores user session used across authenticated screens. |
| `SIGN_IN_GOOGLE`                 | `POST`  | `/auth/signin/google`                                                                | Sends `{ credential: idToken, tenantId, referrer? }`; response is consumed like `SIGN_IN`; missing referrer error redirects user to `ReferralCode` flow.                                                              |
| `SIGN_IN_APPLE`                  | `POST`  | `/auth/signin/apple`                                                                 | Sends `{ credential: identityToken, tenantId, referrer? }`; response fills session and profile, and if backend `name` is empty the app patches user name with Apple full name.                                        |
| `SIGN_UP`                        | `POST`  | `/auth/signup`                                                                       | Sends onboarding payload (`tenantId`, `email`, `password`, `confirmation`, `name`, locale, verification/callback, optional UTM); response tokens are stored and user enters post-signup verification flow.            |
| `VERIFY`                         | `GET`   | `/auth/verify-sign-up`                                                               | Sends query `{ email, token: code, tenantId }` with bearer token; app reads `verified` and marks local user as verified (email confirmation completed).                                                               |
| `REFRESH_TOKEN`                  | `POST`  | `/auth/refresh-token`                                                                | Sends `{ refreshToken }`; response `{ token, refreshToken }` replaces stored credentials and keeps user logged in.                                                                                                    |
| `REQUEST_VERIFICATION_CODE`      | `POST`  | `/auth/request-confirmation-email`                                                   | Sends `{ email, tenantId, verificationType, callbackUrl }`; used by “resend code” action on verification screens.                                                                                                     |
| `REQUEST_RESET_PASSWORD`         | `POST`  | `/auth/request-password-reset`                                                       | Sends `{ email, tenantId, callbackUrl, verificationType }`; triggers password-reset message to user.                                                                                                                  |
| `RESET_PASSWORD`                 | `POST`  | `/auth/reset-password`                                                               | Sends `{ email, token, password, confirmation, tenantId }`; response tokens and user identity are stored to re-authenticate user after reset.                                                                         |
| `GET_PROFILE`                    | `GET`   | `/users/profile`                                                                     | No body; returns profile (`createdAt`, `referralCode`, `mainWallet`, etc.) used for wallet claim checks, account data, and modal timing/sharing behavior.                                                             |
| `PATCH_PROFILE`                  | `PATCH` | `/users/{TENANT_ID}/profile`                                                         | Sends full profile object with updated `name`; response is not heavily parsed, and local user state is updated so new name appears in UI.                                                                             |
| `PATCH_USER`                     | `PATCH` | `/users/{TENANT_ID}/profile`                                                         | Sends `{ name }` in Apple first-login fallback; used only to persist missing backend name.                                                                                                                            |
| `UPDATE_PHONE`                   | `PATCH` | `/users/phone`                                                                       | Sends `{ phone }`; success updates local user to `phoneVerified: false`, driving phone-verification prompts/UI state.                                                                                                 |
| `VERIFY_PHONE`                   | `PATCH` | `/users/phone/verify`                                                                | Sends `{ code }`; on success local `phoneVerified` becomes `true`, enabling verified-phone dependent flows.                                                                                                           |
| `VERIFY_PHONE_RESEND_TOKEN`      | `PATCH` | `/users/phone/resend-verification-code`                                              | No body; triggers new SMS verification code and keeps user in phone verification UI.                                                                                                                                  |
| `CHECK_REFERRER`                 | `GET`   | `/users/{TENANT_ID}/by-referral-code/{referralCode}`                                 | Path param `referralCode`; response fields like `firstName`/`id` validate invite links and set `referrerName` shown during signup (`ReferralCode`, `ScanQRCode`, `Start`).                                            |
| `GET_USER_BY_REFERRAL`           | `GET`   | `/users/{TENANT_ID}/by-referral-code/{referralCode}`                                 | Path param `referralCode`; app consumes returned `id` to fetch the linked restaurant and redirect user into payment flow.                                                                                             |
| `CLAIM_WALLET`                   | `POST`  | `/users/{TENANT_ID}/wallets/vault/claim`                                             | No body; executed when profile has no `mainWallet`, so account receives a wallet before balance/order features are used.                                                                                              |
| `CHECK_WHITELIST`                | `GET`   | `/whitelists/{TENANT_ID}/check-user`                                                 | Sends query `{ userId, whitelistsIds[] }`; response `hasAccess` marks user as ambassador in affiliate/network features.                                                                                               |
| `ANSWER_RESTAURANT`              | `POST`  | `/users/{TENANT_ID}/documents/{userId}/context/57704610-69eb-427c-a344-e540a2c2a33a` | Sends KYC `documents[]` (three fixed `inputId`s with address/place payload); response is not rendered directly, but completes onboarding questionnaire submission.                                                    |
| `SUGGEST_RESTAURANT`             | `POST`  | `/users/{TENANT_ID}/documents/{userId}/context/6d609bdd-51f8-4fac-bb13-f29e880b6e0e` | Sends one `documents[]` item with Google place-derived address object (`home`, `street`, `city`, `region`, `postal_code`, `country`, `placeId`).                                                                      |
| `GET_USER_DOCUMENT`              | `GET`   | `/users/{TENANT_ID}/documents/{userId}/context/{contextId}`                          | Returns document array; app maps `inputId` values to notification switches “Notificação de Cashback” and “Notificação de Comissão”.                                                                                   |
| `PATCH_USER_DOCUMENT`            | `PATCH` | `/users/{TENANT_ID}/documents/{userId}/context/{contextId}`                          | Sends `{ documents: [{ inputId, value: 'true' or 'false' }] }`; persists notification toggle state from `Notifications` screen. |
| `GET_USER_AFFILIATIONS`          | `GET`   | `/users/affiliations`                                                                | Sends paging/sort query (`page`, `limit`, `sortBy`, `orderBy`); response `items` + `meta.totalPages` populates “Indicações Diretas” list and “Entrou em dd/MM/yyyy”.                                                  |
| `GET_AFFILIATE_MULTILEVEL_STATS` | `GET`   | `/users/affiliations-report`                                                         | No body; response (`levelReport`, `globalReport`) feeds affiliate dashboard metrics (quantities/rank), combined with key-service usage values.                                                                        |
| `REQUEST_ACCOUNT_EXCLUSION`      | `POST`  | `/users/request-account-exclusion`                                                   | Sends optional `{ reason }`; used by settings account deletion flow (response mainly used as success/failure signal).                                                                                                 |
| `REQUEST_INVITATION`             | `POST`  | `https://n8n.srv867127.hstgr.cloud/webhook/50855c7d-d728-42c2-a9be-675d45623298`     | Sends `{ name, telephone, email? }` with basic auth; acts as lead/invitation webhook (outside W3Block hosts).                                                                                                         |

### Commerce service (`WEBLOCK_COMMERCE_HOST`)

| Route key            | Method   | Path template                                                       | App behavior (params sent, response used, UI impact)                                                                                                                                                           |
| -------------------- | -------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PREVIEW_ORDER`      | `POST`   | `/companies/{TENANT_ID}/orders/preview`                             | Sends draft checkout payload (`orderProducts`, `couponCode`, destination wallet, mixed BRL+ZUCA `payments`); response preview values are used to display/validate payment composition before final submission. |
| `CREATE_ORDER`       | `POST`   | `/companies/{TENANT_ID}/orders`                                     | Sends finalized order (`quantity`, `expectedPrice`, `payments`, `providerInputs`, optional waiter/UTM); response (`OrderCreateResponse`) drives payment continuation, status checks, and post-purchase flow.   |
| `GET_ORDERS`         | `GET`    | `/companies/{TENANT_ID}/orders`                                     | Sends filters/sort (`page`, `limit`, `status[]`, `createdAt DESC`); response populates order history list in statement module.                                                                                 |
| `GET_ORDER_BY_ID`    | `GET`    | `/companies/{TENANT_ID}/orders/{orderId}`                           | Path param `orderId` with query `{ fetchNewestStatus }`; response is used for order detail and status polling updates.                                                                                         |
| `GET_ORDERS_STATS`   | `GET`    | `/companies/{TENANT_ID}/orders/usage-report`                        | Sends `{ status: 'concluded' }`; response `report[]` totals are filtered by BRL/ZUCA currency IDs to compute network usage KPIs.                                                                               |
| `GET_CREDIT_CARDS`   | `GET`    | `/companies/{TENANT_ID}/users/{userId}/credit-cards`                | Path param `userId`; response `items[]` (`brand`, `lastNumbers`, `name`, `id`) feeds saved-card selectors and management screens.                                                                              |
| `CREATE_CREDIT_CARD` | `POST`   | `/companies/{TENANT_ID}/users/{userId}/credit-cards`                | Sends normalized card data (`number`, `cvv`, expiry, label `name`) and `holderInfo`; response is used as success result before refreshing card list UI.                                                        |
| `DELETE_CREDIT_CARD` | `DELETE` | `/companies/{TENANT_ID}/users/{userId}/credit-cards/{creditCardId}` | Path params `userId` + `creditCardId`; success response is used to remove the card from local list/state.                                                                                                      |

### Key service (`WEBLOCK_KEY_HOST`)

| Route key                        | Method | Path template                                                                        | App behavior (params sent, response used, UI impact)                                                                                            |
| -------------------------------- | ------ | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `ZUCA_BALANCE`                   | `GET`  | `/{TENANT_ID}/loyalties/users/balance/{userId}`                                      | Path param `userId`; response list is filtered by `loyaltyId === ZUCA_LOYALTY_ID` and used as the wallet/points balance displayed to user.      |
| `ZUCA_HISTORY`                   | `GET`  | `/{TENANT_ID}/erc20-tokens/{ZUCA_CONTRACT_ID}/history/{userId}`                      | Path param `userId` plus query `{ page, limit }`; response transaction history feeds the statement/history timeline.                            |
| `GET_AFFILIATE_MULTILEVEL_USAGE` | `GET`  | `/{TENANT_ID}/loyalties/users/{userId}/cashback-multilevel-report/{ZUCA_LOYALTY_ID}` | Path params `userId`, `ZUCA_LOYALTY_ID`; response `reportPerLevel` is converted into per-level commission totals and global affiliate earnings. |

### CMS / content endpoints

| Route key                  | Method | Host source            | Path/query                                       | App behavior (params sent, response used, UI impact)                                                                                                                                                       |
| -------------------------- | ------ | ---------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BROWSE_RESTAURANTS`       | `GET`  | `CMS_HOST`             | `/api/restaurantes?populate[image][*]&sort=name` | Sends different filters by screen (`active/searchKeywords`, `slug`, `businessReferrerUserId`, `weblockUserId`); response `data[].attributes` populates restaurant cards and deep-link payment redirection. |
| `GET_RESTAURANT_BY_FILTER` | `GET`  | `CMS_HOST`             | `/api/restaurantes?populate[image][*]`           | Sends wallet filter (`filters[walletAddress]`) and sorting; response first match is used to resolve restaurant by wallet.                                                                                  |
| `GET_CONFIG`               | `GET`  | `CMS_HOST`             | `/api/configs`                                   | Returns config list; app filters by `attributes.name === key` and consumes `attributes.value` for feature/config toggles.                                                                                  |
| `GET_MODALS`               | `GET`  | static (`cms.zuca.ai`) | `/api/home-modals?populate[image][*]`            | Sends modal filters (`active`, `location`, `priority`); response fields (`title`, `description`, `closeButtonLabel`, timing rules) define modal copy/CTA shown to user.                                    |
| `GET_BANNERS`              | `GET`  | static (`cms.zuca.ai`) | `/api/banners?populate[image][*]`                | Sends filters for active latest banner; response image + `url` or `restaurantId/value` drives clickable home banner behavior (open link or open payment with locked value).                                |

## Field map (context and input IDs)

This section maps hardcoded `contextId` / `inputId` values to what users actually see in the app.

### Notifications preferences (`GET_USER_DOCUMENT` / `PATCH_USER_DOCUMENT`)

- Route context: `0274707f-0b82-4cc2-897b-76f345389a0c`
- Screen: `NotificationsScreen`

| inputId | UI label shown to user | Value semantics in app |
|---|---|---|
| `70287d2f-c25e-4807-9e11-21fedd62afc8` | `Notificação de Comissão` | Switch ON means enabled; app persists inverse (`value: 'true'` means disabled, `value: 'false'` means enabled). |
| `09212a3b-5779-4748-b456-0303206c553c` | `Notificação de Cashback` | Same rule as above (backend stores disable flag while UI shows enable state). |

### Onboarding restaurant answers (`ANSWER_RESTAURANT`)

- Route context: `57704610-69eb-427c-a344-e540a2c2a33a`
- Screen text: `Quais são os seus três restaurantes brasileiros favoritos?`
- Input IDs are positional (same payload shape, mapped by index):

| order in payload | inputId | UI meaning |
|---|---|---|
| 1st selected restaurant | `bd26159c-4a9f-43fa-bfa6-4bf688afafcd` | Restaurante favorito nº 1 |
| 2nd selected restaurant | `f4a06f78-98f8-40e4-921e-3ffcc78542b0` | Restaurante favorito nº 2 |
| 3rd selected restaurant | `69a9da07-9e8a-450b-ae5b-ca7fa19dca2c` | Restaurante favorito nº 3 |

### Browse suggestion submission (`SUGGEST_RESTAURANT`)

- Route context: `6d609bdd-51f8-4fac-bb13-f29e880b6e0e`
- Input ID used:

| inputId | Triggering UI | Stored value |
|---|---|---|
| `1f0c686d-fc15-4f43-869b-f8ae2da27e7a` | Browse suggestion flow (`Não encontramos o estabelecimento... Gostaria de sugerir algum destes?`) | Object with `home`, `street`, `city`, `region`, `postal_code`, `country`, `placeId`. |

## Notes and caveats

- `GET_AFFILIATE_MULTILEVEL_STATS` is in the ID host (`/users/affiliations-report`), while `GET_AFFILIATE_MULTILEVEL_USAGE` is in the Key host; both are combined by `useGetAffiliateNetworkData`.
- `CHECK_REFERRER` and `GET_USER_BY_REFERRAL` currently resolve to the same endpoint template.
- `PATCH_USER` and `PATCH_PROFILE` currently resolve to the same endpoint template.
- `REQUEST_INVITATION` is the only route not tied to the three W3Block hosts (hardcoded n8n webhook).
- `GET_MODALS` / `GET_BANNERS` currently bypass `CMS_HOST` and use hardcoded `https://cms.zuca.ai`.

## Practical usage examples

```ts
// public auth call
await axios.post(routes.SIGN_IN(), {
  tenantId: TENANT_ID,
  email,
  password,
});

// authenticated profile call
const secureAxios = useAuthAxios();
const { data } = await secureAxios.get(routes.GET_PROFILE());

// commerce order preview
const preview = await axios.post(routes.PREVIEW_ORDER(), params);

// key service loyalty balance
const balance = await axios.get(routes.ZUCA_BALANCE(userId));
```
