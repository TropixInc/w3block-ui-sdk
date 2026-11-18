/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Key, ReactNode } from 'react';
import { useToggle } from 'react-use';

import { WalletTypes } from '@w3block/sdk-id';
import classNames from 'classnames';

import { ErrorBox } from '../../shared/components/ErrorBox';
import { KpiCard, KpiRow } from '../../shared/components/ui/KpiCard';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { UI } from '../../shared/components/ui/tokens';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useProfile } from '../../shared/hooks/useProfile';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import useTranslation from '../../shared/hooks/useTranslation';
import { useLocale } from '../../shared/hooks/useLocale';
import { useUserWallet } from '../../shared/hooks/useUserWallet/useUserWallet';
import { formatAmount } from '../../shared/utils/formatAmount';

/**
 * Header of the pass pages (operator tool): title, subtitle, the balance
 * chips with the show/hide toggle and the add-funds link, then the page
 * content. `classes` is kept for the callers that override the chrome.
 */
export const BaseTemplate = ({
  children,
  classes,
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  classes?: {
    modal?: string;
    title?: string;
  };
}) => {
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const [showValue, toggleShowValue] = useToggle(false);
  const { data: profile, error: errorProfile } = useProfile();
  const { mainWallet: wallet, loyaltyWallet } = useUserWallet();
  const loyalty = loyaltyWallet?.[0];
  const locale = useLocale();
  const walletBalance = wallet?.balance ?? '0';
  const isLoading = wallet == undefined;
  const wallets = (profile?.data.wallets ?? []) as Array<{
    type: WalletTypes;
    id: Key | null | undefined;
  }>;

  if (errorProfile) return <ErrorBox customError={errorProfile as any} />;

  return (
    <div
      className={classNames(
        classes?.modal ??
          'pw-flex pw-flex-col pw-gap-4 pw-px-4 sm:pw-px-0 pw-mb-[60px]'
      )}
    >
      <PageHeader
        title={title}
        subtitle={subtitle}
        className={classes?.title}
        actions={
          <>
            {actions}
            <a
              href={router.routerToHref(PixwayAppRoutes.ADD_FUNDS_TYPE)}
              className={UI.buttonSecondary}
            >
              {translate('wallet>page>addFunds')}
            </a>
          </>
        }
      />
      <KpiRow>
        {(isLoading
          ? [{ type: WalletTypes.Vault, id: 'loading' }]
          : wallets
        ).map((w) => (
          <button
            key={String(w.id)}
            type="button"
            onClick={() => toggleShowValue()}
            aria-pressed={showValue}
            className={classNames(
              'pw-text-left pw-rounded-[10px]',
              UI.focusRing
            )}
          >
            <KpiCard
              variant="accent"
              label={
                w.type === WalletTypes.Vault
                  ? translate('wallet>page>balance')
                  : translate('wallet>page>metamask')
              }
              value={
                showValue
                  ? formatAmount(
                      walletBalance,
                      locale,
                      loyalty?.pointsPrecision
                    )
                  : '•••••'
              }
              unit={showValue ? loyalty?.currency : undefined}
              hint={
                showValue
                  ? translate('pass>baseTemplate>tapToHide')
                  : translate('pass>baseTemplate>tapToShow')
              }
              loading={isLoading}
            />
          </button>
        ))}
      </KpiRow>
      {children}
    </div>
  );
};
