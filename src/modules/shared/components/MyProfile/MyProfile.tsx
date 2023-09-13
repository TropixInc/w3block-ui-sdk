import { Trans } from 'react-i18next';
import { useToggle } from 'react-use';

import { WalletTypes } from '@w3block/sdk-id';

import { ChipWallet } from '../../../auth/components/WalletInternalTemplate/ChipWallet';
import { ReactComponent as CashIcon } from '../../../shared/assets/icons/cashFilled.svg';
import { ReactComponent as EyeIcon } from '../../../shared/assets/icons/eyeIcon.svg';
import { ReactComponent as EyeCrossedIcon } from '../../../shared/assets/icons/eyeIconCrossed.svg';
import { ReactComponent as MetamaskIcon } from '../../../shared/assets/icons/metamask.svg';
import { ReactComponent as WalletIcon } from '../../../shared/assets/icons/walletOutlined.svg';
import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { useRouterConnect } from '../../hooks';
import { useProfile } from '../../hooks/useProfile';
import useTranslation from '../../hooks/useTranslation';
import { useUserWallet } from '../../hooks/useUserWallet';
import { useGetRightWallet } from '../../utils/getRightWallet';
import { Link } from '../Link';

export const MyProfile = () => {
  const { data: profile } = useProfile();
  const router = useRouterConnect();
  const [showValue, toggleShowValue] = useToggle(false);
  const [translate] = useTranslation();
  const { mainWallet: wallet } = useUserWallet();
  const isLoading = wallet == undefined;
  const organizedWallets = useGetRightWallet();

  return (
    <div className="pw-w-full pw-flex pw-flex-col pw-gap-[34px] pw-items-start pw-bg-white pw-rounded-[20px] pw-shadow-[2px_2px_10px] pw-shadow-[#00000014] pw-p-[34px]">
      <div className="pw-flex sm:pw-justify-between pw-justify-center pw-items-center pw-w-full">
        <p className="pw-text-2xl pw-font-semibold pw-font-poppins">
          {translate('components>menu>myProfile')}
        </p>
        <div className="sm:pw-flex pw-items-center pw-gap-4 pw-shrink-0 pw-hidden">
          <div
            className="pw-w-[33px] pw-h-[33px] pw-border-2 pw-border-[#353945] pw-rounded-full pw-cursor-pointer pw-flex pw-justify-center pw-items-center"
            onClick={() => toggleShowValue()}
          >
            {showValue ? (
              <EyeIcon className="pw-stroke-brand-primary" />
            ) : (
              <EyeCrossedIcon className="pw-stroke-brand-primary" />
            )}
          </div>
          {isLoading ? (
            <ChipWallet.Skeleton />
          ) : (
            profile?.data.wallets?.map(
              (wallet: { type: WalletTypes; id: string }) => {
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
              }
            )
          )}
          {organizedWallets &&
          organizedWallets.length > 0 &&
          organizedWallets[0].type != 'loyalty' ? (
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
          ) : null}
        </div>
      </div>
      <div className="pw-w-full pw-flex pw-flex-col pw-gap-[34px]">
        <div>
          <p>E-mail</p>
          <div className=" pw-w-full pw-bg-white pw-text-black">
            {profile?.data.email ?? '-'}
          </div>
        </div>
      </div>
    </div>
  );
};
