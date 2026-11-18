/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Key, ReactNode } from 'react';
import { useToggle } from 'react-use';

import { WalletTypes } from '@w3block/sdk-id';
import classNames from 'classnames';

import EyeIcon from '../../shared/assets/icons/eyeIcon.svg';
import EyeCrossedIcon from '../../shared/assets/icons/eyeIconCrossed.svg';
import MetamaskIcon from '../../shared/assets/icons/metamask.svg';
import WalletIcon from '../../shared/assets/icons/walletOutlined.svg';
import { ErrorBox } from '../../shared/components/ErrorBox';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { UI } from '../../shared/components/ui/tokens';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useProfile } from '../../shared/hooks/useProfile';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import useTranslation from '../../shared/hooks/useTranslation';
import { useUserWallet } from '../../shared/hooks/useUserWallet/useUserWallet';
import { Chip } from './Chip';

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
  const { mainWallet: wallet } = useUserWallet();
  const walletBalance = wallet?.balance ?? '0';
  const isLoading = wallet == undefined;

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
            <div className="pw-flex pw-items-center pw-gap-2 pw-flex-wrap">
              <button
                type="button"
                onClick={() => toggleShowValue()}
                aria-pressed={showValue}
                className="pw-grid pw-place-items-center pw-w-9 pw-h-9 pw-rounded-full pw-border pw-border-[#E6E8EC] pw-bg-white hover:pw-bg-[#F7F8FA]"
                aria-label={translate('wallet>page>balance')}
              >
                {showValue ? (
                  <EyeIcon className="pw-stroke-brand-primary" />
                ) : (
                  <EyeCrossedIcon className="pw-stroke-brand-primary" />
                )}
              </button>
              {isLoading ? (
                <Chip.Skeleton />
              ) : (
                profile?.data.wallets?.map(
                  (w: { type: WalletTypes; id: Key | null | undefined }) =>
                    w.type === WalletTypes.Vault ? (
                      <Chip
                        key={w.id}
                        showValue={showValue}
                        value={walletBalance}
                        Icon={() => (
                          <WalletIcon className="pw-stroke-brand-primary" />
                        )}
                        title={translate('wallet>page>balance')}
                      />
                    ) : (
                      <Chip
                        key={w.id}
                        showValue={showValue}
                        value={walletBalance}
                        Icon={() => (
                          <MetamaskIcon className="pw-stroke-brand-primary" />
                        )}
                        title={translate('wallet>page>metamask')}
                      />
                    )
                )
              )}
              <a
                href={router.routerToHref(PixwayAppRoutes.ADD_FUNDS_TYPE)}
                className={UI.buttonSecondary}
              >
                {translate('wallet>page>addFunds')}
              </a>
            </div>
          </>
        }
      />
      {children}
    </div>
  );
};
