import { Trans } from 'react-i18next';
import { useToggle } from 'react-use';

import { WalletTypes } from '@w3block/sdk-id';

import { ChipWallet } from '../../../auth/components/WalletInternalTemplate/ChipWallet';
import { ReactComponent as CashIcon } from '../../assets/icons/cashFilled.svg';
import { ReactComponent as EyeIcon } from '../../assets/icons/eyeIcon.svg';
import { ReactComponent as EyeCrossedIcon } from '../../assets/icons/eyeIconCrossed.svg';
import { ReactComponent as MetamaskIcon } from '../../assets/icons/metamask.svg';
import { ReactComponent as WalletIcon } from '../../assets/icons/walletOutlined.svg';
import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { useHasWallet, useProfile, useRouterConnect } from '../../hooks';
import useTranslation from '../../hooks/useTranslation';
import { useUserWallet } from '../../hooks/useUserWallet';
import { Link } from '../Link';

interface InternalPageHeaderWithFundsProps {
  title?: string;
}

export const InternalpageHeaderWithFunds = ({
  title = 'Carteira',
}: InternalPageHeaderWithFundsProps) => {
  const [translate] = useTranslation();
  const [showValue, toggleShowValue] = useToggle(false);
  useHasWallet({});
  const { data: profile } = useProfile();
  const { wallet } = useUserWallet();
  const router = useRouterConnect();
  const isLoading = wallet == undefined;

  return (
    <div className="pw-bg-[#F7F7F7] pw-border pw-border-[#E4E4E4] pw-rounded-[14px] pw-p-6 pw-shadow-[0px_4px_20px_rgba(0,0,0,0.12)] pw-flex pw-flex-col pw-gap-[24px]">
      <div className="pw-w-full pw-items-center pw-justify-between sm:pw-flex">
        <div>
          <span className="pw-font-semibold pw-text-lg pw-flex pw-items-baseline sm:pw-text-[23px] pw-leading-[32px]">
            {title}
          </span>
        </div>

        <div className="pw-flex pw-items-center pw-mt-6 sm:pw-mt-0 pw-gap-2 sm:pw-gap-4">
          <div
            className="pw-w-[33px] pw-h-[33px] pw-border-2 pw-border-[#353945] pw-rounded-full pw-cursor-pointer pw-flex pw-justify-center pw-items-center"
            onClick={() => toggleShowValue()}
          >
            {showValue ? (
              <EyeIcon className="pw-stroke-brand-primary pw-w-4 sm:pw-w-auto" />
            ) : (
              <EyeCrossedIcon className="pw-stroke-brand-primary pw-w-4 sm:pw-w-auto" />
            )}
          </div>
          {isLoading ? (
            <ChipWallet.Skeleton />
          ) : (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            profile?.data.wallets?.map((wallet: any) => {
              return wallet.type === WalletTypes.Vault ? (
                <ChipWallet
                  key={wallet.id}
                  showValue={showValue}
                  Icon={() => (
                    <WalletIcon className="pw-stroke-brand-primary" />
                  )}
                  title={translate('wallet>page>balance')}
                />
              ) : (
                <ChipWallet
                  key={wallet.id}
                  showValue={showValue}
                  Icon={() => (
                    <MetamaskIcon className="pw-stroke-brand-primary" />
                  )}
                  title={translate('wallet>page>metamask')}
                />
              );
            })
          )}
          <Link href={router.routerToHref(PixwayAppRoutes.ADD_FUNDS_TYPE)}>
            <div className="pw-w-[165px] pw-bg-brand-primary pw-p-[8px_16px_8px_11px] pw-border-2 pw-border-[#353945] pw-rounded-[48px] pw-flex pw-justify-start pw-items-center pw-gap-2">
              <div className="pw-rounded-full pw-border pw-bg-brand-primary pw-border-white pw-w-[30px] pw-h-[30px] pw-p-[5px] pw-flex pw-justify-center pw-items-center">
                <CashIcon className="pw-fill-white" />
              </div>
              <div className="pw-w-[1px] pw-bg-[#DCDCDC] pw-h-[32px]" />
              <div className="pw-flex pw-flex-col pw-items-start pw-text-white pw-font-semibold pw-text-[13px] pw-leading-[13px] pw-cursor-pointer">
                <Trans i18nKey={'wallet>page>addFunds'}>
                  <span>Adicionar</span>
                  Fundos
                </Trans>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
