/* eslint-disable i18next/no-literal-string */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

import classNames from 'classnames';

import useGetProductById from '../../storefront/hooks/useGetProductById';
import { useGetNFTSByWallet } from '../../tokens/hooks/useGetNFTSByWallet';
import { mapNFTToToken } from '../../tokens/utils/mapNFTToToken';
import { PixwayAppRoutes } from '../enums/PixwayAppRoutes';
import { useAcceptIntegrationToken } from '../hooks/useAcceptIntegrationToken';
import { useHasWallet } from '../hooks/useHasWallet';
import { usePrivateRoute } from '../hooks/usePrivateRoute';
import { useProfile } from '../hooks/useProfile';
import { useRouterConnect } from '../hooks/useRouterConnect';
import useTranslation from '../hooks/useTranslation';
import { useUserWallet } from '../hooks/useUserWallet/useUserWallet';
import { sanitizeHtml } from '../utils/sanitizeHtml';
import { Alert } from './Alert';
import { BaseButton } from './Buttons';
import { ErrorBox } from './ErrorBox';
import { Spinner } from './Spinner';
import TranslatableComponent from './TranslatableComponent';
import { EmptyState } from './ui/EmptyState';
import { UI } from './ui/tokens';

enum Steps {
  DEFAULT = 'default',
  ERROR = 'error',
  SUCCESS = 'success',
}

/**
 * Cross-tenant account link. Opened in a popup by the other tenant with the
 * link data in the query string; without that data there is nothing to
 * confirm, so the page says so instead of asking a question with blanks.
 */
const _LinkAccountTemplate = () => {
  const router = useRouterConnect();
  const fromTenantName = (router.query.fromTentant as string) ?? '';
  const toTenantName = (router.query.toTenant as string) ?? '';
  const toTenantId = (router.query.toTenantId as string) ?? '';
  const token = (router.query.token as string) ?? '';
  const fromEmail = (router.query.fromEmail as string) ?? '';
  const productId = (router.query.productId as string) ?? '';
  const productCollectionId = (router.query.collectionId as string) ?? '';
  const autoCloseOnSuccess = router.query.autoCloseOnSuccess?.includes('true')
    ? true
    : false;
  const linkMessage = (router.query.linkMessage as string) ?? '';
  const purchaseRequiredModalContent =
    (router.query.purchaseRequiredModalContent as string) ?? '';
  const { data: profile, error: errorProfile } = useProfile();
  const {
    mutate: acceptIntegration,
    isPending,
    error: errorAcceptIntegration,
  } = useAcceptIntegrationToken();
  const [step, setSteps] = useState('');
  const [translate] = useTranslation();
  const { mainWallet: wallet } = useUserWallet();
  const [{ data: ethNFTsResponse, error: errorEthNFT }] = useGetNFTSByWallet(
    wallet?.chainId
  );
  const tokens =
    ethNFTsResponse?.data.items.map((nft: any) =>
      mapNFTToToken(nft, wallet?.chainId || 137)
    ) || [];

  const collections = productCollectionId.split('|');

  const userHasProduct = tokens.some((data: any) => {
    return collections.some((col) => {
      return data?.collectionData?.id === col;
    });
  });

  const { data: product } = useGetProductById(productId);
  const hasLinkData = Boolean(token && toTenantId);

  const handleClose = () => {
    window.close();
  };

  const sendMessage = () => {
    const targetWindow = window.opener;
    if (!userHasProduct && targetWindow) {
      targetWindow.postMessage('user_linked_no_required_product_found', '*');
    }
  };

  const handleAccept = () => {
    acceptIntegration(
      { token, tenantId: toTenantId },
      {
        onError() {
          setSteps(Steps.ERROR);
        },
        onSuccess() {
          sendMessage();
          if (autoCloseOnSuccess && userHasProduct) {
            window.close();
          } else if (
            productId !== '' &&
            !userHasProduct &&
            purchaseRequiredModalContent === ''
          ) {
            router.pushConnect(
              PixwayAppRoutes.PRODUCT_PAGE.replace(
                '{slug}',
                product?.slug ?? ''
              )
            );
          } else {
            setSteps(Steps.SUCCESS);
          }
        },
      }
    );
  };

  const closeButton = (label: string) => (
    <button
      type="button"
      onClick={handleClose}
      disabled={isPending}
      className={UI.buttonSecondary}
    >
      {label}
    </button>
  );
  // Values interpolated into the tenant-provided message are escaped so a
  // crafted name or e-mail cannot inject markup into it.
  const escapeHtml = (value: string) =>
    value.replace(
      /[&<>"']/g,
      (c) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        }[c] as string)
    );
  const message = (html: string) => (
    <div
      className={classNames(
        'pw-text-[15px] pw-leading-snug pw-break-words [&_p]:pw-m-0',
        UI.text
      )}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  );

  const renderInternal = () => {
    if (!hasLinkData) {
      return (
        <EmptyState
          bare
          title={translate('shared>linkAccountTemplate>missingDataTitle')}
          description={translate(
            'shared>linkAccountTemplate>missingDataDescription'
          )}
          action={closeButton(translate('components>walletIntegration>close'))}
          className="pw-py-4"
        />
      );
    }
    switch (step) {
      case Steps.ERROR:
        return (
          <>
            <Alert variant="error">
              <Alert.Icon />
              {translate('shared>linkAccountTemplate>errorInIntegration')}
            </Alert>
            <div className="pw-mt-4 pw-flex pw-justify-center">
              {closeButton(translate('components>walletIntegration>close'))}
            </div>
          </>
        );
      case Steps.SUCCESS:
        return errorEthNFT ? (
          <ErrorBox customError={errorEthNFT} />
        ) : (
          <>
            {userHasProduct ? (
              <p
                className={classNames(
                  'pw-text-[15px] pw-font-medium pw-m-0',
                  UI.text
                )}
              >
                {translate('shared>linkAccountTemplate>doneAccountVinculate', {
                  fromTenantName,
                })}
              </p>
            ) : purchaseRequiredModalContent !== '' ? (
              message(purchaseRequiredModalContent)
            ) : productId !== '' ? (
              <Spinner className="pw-mx-auto" />
            ) : (
              <p
                className={classNames(
                  'pw-text-[15px] pw-font-medium pw-m-0',
                  UI.text
                )}
              >
                {translate(
                  'shared>linkAccountTemplate>doneAccountVinculateWithTokens'
                )}{' '}
                <b>{toTenantName}</b>{' '}
                {translate(
                  'shared>linkAccountTemplate>doneAccountVinculateWithTokens2'
                )}{' '}
                <b>{fromTenantName}</b>.
              </p>
            )}
            <div className="pw-mt-4 pw-flex pw-flex-wrap pw-gap-2 pw-justify-center">
              {closeButton(translate('components>walletIntegration>close'))}
              {purchaseRequiredModalContent !== '' &&
              productId !== '' &&
              !userHasProduct ? (
                <BaseButton
                  onClick={() =>
                    router.pushConnect(
                      PixwayAppRoutes.PRODUCT_PAGE.replace(
                        '{slug}',
                        product?.slug ?? ''
                      )
                    )
                  }
                >
                  {translate('components>advanceButton>continue')}
                </BaseButton>
              ) : null}
            </div>
          </>
        );
      default:
        return (
          <>
            {linkMessage !== '' ? (
              message(
                linkMessage
                  .replace('{{:toTenant}}', escapeHtml(toTenantName))
                  .replace(
                    '{{:toEmail}}',
                    escapeHtml(profile?.data?.email ?? '')
                  )
                  .replace('{{:fromTenant}}', escapeHtml(fromTenantName))
                  .replace('{{:fromEmail}}', escapeHtml(fromEmail))
              )
            ) : (
              <div className="pw-flex pw-flex-col pw-gap-3">
                <p
                  className={classNames(
                    'pw-text-[15px] pw-font-medium pw-m-0',
                    UI.text
                  )}
                >
                  {translate('shared>linkAccountTemplate>vinculateAccount')}{' '}
                  {translate('shared>linkAccountTemplate>vinculateAccount2')}
                </p>
                <div className="pw-grid pw-grid-cols-1 sm:pw-grid-cols-2 pw-gap-2">
                  {[
                    { name: fromTenantName, email: fromEmail },
                    { name: toTenantName, email: profile?.data?.email ?? '' },
                  ].map((account, index) => (
                    <div
                      key={index}
                      className="pw-rounded-[10px] pw-border pw-border-[#E6E8EC] pw-px-3 pw-py-2.5 pw-min-w-0"
                    >
                      <p
                        className={classNames(
                          'pw-text-[13px] pw-font-semibold pw-truncate pw-m-0',
                          UI.text
                        )}
                      >
                        {account.name || '—'}
                      </p>
                      <p
                        className={classNames(
                          'pw-text-[12px] pw-truncate pw-m-0',
                          UI.textMuted
                        )}
                        title={account.email}
                      >
                        {account.email || '—'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <ErrorBox customError={errorAcceptIntegration} />
            <div className="pw-mt-4 pw-flex pw-flex-wrap pw-gap-2 pw-justify-center">
              {closeButton(translate('shared>no'))}
              <BaseButton disabled={isPending} onClick={handleAccept}>
                {translate('shared>yes')}
              </BaseButton>
            </div>
          </>
        );
    }
  };

  return errorProfile ? (
    <ErrorBox customError={errorProfile} />
  ) : (
    <div className="pw-w-screen pw-min-h-screen pw-bg-[#F3F5F8] pw-font-poppins">
      <div className="pw-w-full pw-pt-16 sm:pw-pt-28 pw-px-4">
        <div
          className={classNames(
            UI.card,
            'pw-mx-auto pw-w-full pw-max-w-[520px] pw-p-6'
          )}
        >
          <p
            className={classNames(
              'pw-text-[11px] pw-font-semibold pw-uppercase pw-tracking-[0.04em] pw-m-0 pw-mb-3',
              UI.textMuted
            )}
          >
            {translate('shared>linkAccountTemplate>title')}
          </p>
          {isPending ? <Spinner className="pw-mx-auto" /> : renderInternal()}
        </div>
      </div>
    </div>
  );
};

export const LinkAccountTemplate = () => {
  const { isAuthorized, isLoading } = usePrivateRoute();
  useHasWallet({});
  if (!isAuthorized || isLoading) {
    return null;
  }
  return (
    <TranslatableComponent>
      <_LinkAccountTemplate />
    </TranslatableComponent>
  );
};
