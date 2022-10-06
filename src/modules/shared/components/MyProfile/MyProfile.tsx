import { useRef } from 'react';
import { Trans } from 'react-i18next';
import { useToggle } from 'react-use';

import { WalletTypes } from '@w3block/sdk-id';
import classNames from 'classnames';

import { ChipWallet } from '../../../auth/components/WalletInternalTemplate/ChipWallet';
import { ReactComponent as CashIcon } from '../../../shared/assets/icons/cashFilled.svg';
import { ReactComponent as EyeIcon } from '../../../shared/assets/icons/eyeIcon.svg';
import { ReactComponent as EyeCrossedIcon } from '../../../shared/assets/icons/eyeIconCrossed.svg';
import { ReactComponent as MetamaskIcon } from '../../../shared/assets/icons/metamask.svg';
import { ReactComponent as WalletIcon } from '../../../shared/assets/icons/walletOutlined.svg';
import { usePatchProfile, useProfile } from '../../hooks/useProfile';
import useTranslation from '../../hooks/useTranslation';
import { useUserWallet } from '../../hooks/useUserWallet';
import { PixwayButton } from '../PixwayButton';

export const MyProfile = () => {
  const [showValue, toggleShowValue] = useToggle(false);
  const { data: profile } = useProfile();
  const [translate] = useTranslation();
  const { wallet } = useUserWallet();
  const walletBalance = wallet?.balance ?? '0';
  const isLoading = wallet == undefined;

  const patchProfile = usePatchProfile();
  const inputRef = useRef<HTMLInputElement>(null);
  const value = inputRef?.current?.value;

  return (
    <div className="pw-max-w-[968px] pw-w-full pw-flex pw-flex-col pw-gap-[34px] pw-items-start pw-bg-white pw-rounded-[20px] pw-shadow-[2px_2px_10px] pw-shadow-[#00000014] pw-p-[34px]">
      <div className="pw-flex sm:pw-justify-between pw-justify-center pw-items-center pw-w-full">
        <p className="pw-text-2xl pw-font-semibold pw-font-poppins">
          {translate('shared>myProfile>myProfile')}
        </p>
        <div className="sm:pw-flex pw-items-center pw-gap-4 pw-shrink-0 pw-hidden">
          <div
            className="pw-w-[33px] pw-h-[33px] pw-border-2 pw-border-[#353945] pw-rounded-full pw-cursor-pointer pw-flex pw-justify-center pw-items-center"
            onClick={() => toggleShowValue()}
          >
            {showValue ? (
              <EyeIcon className="pw-stroke-[#B09C60]" />
            ) : (
              <EyeCrossedIcon className="pw-stroke-[#B09C60]" />
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
                    value={walletBalance}
                    Icon={() => <WalletIcon className="pw-stroke-[#B09C60]" />}
                    title={translate('wallet>page>balance')}
                  />
                ) : (
                  <ChipWallet
                    key={wallet.id}
                    showValue={showValue}
                    value={walletBalance}
                    Icon={() => (
                      <MetamaskIcon className="pw-stroke-[#B09C60]" />
                    )}
                    title={translate('wallet>page>metamask')}
                  />
                );
              }
            )
          )}
          <div className="pw-w-[165px] pw-bg-[#B09C60] pw-p-[8px_16px_8px_11px] pw-border-2 pw-border-[#353945] pw-rounded-[48px] pw-flex pw-justify-start pw-items-center pw-gap-2">
            <div className="pw-rounded-full pw-border pw-bg-[#B09C60] pw-border-white pw-w-[30px] pw-h-[30px] pw-p-[5px] pw-flex pw-justify-center pw-items-center">
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
        </div>
      </div>
      <div className="pw-w-full pw-flex pw-flex-col pw-gap-[34px]">
        <div>
          <p>{translate('shared>myProfile>name')}</p>
          <input
            className="pw-p-[10px] pw-border pw-border-[#B09C60] pw-w-full pw-rounded-[8px]"
            type="text"
            name="name"
            defaultValue={profile?.data?.name ?? ''}
            ref={inputRef}
          />
        </div>
        <div>
          <p>E-mail</p>
          <input
            className="pw-p-[10px] pw-border pw-border-[#B09C60] pw-w-full pw-rounded-[8px]"
            type="text"
            disabled
            value={profile?.data.email ?? ''}
          />
        </div>
        <PixwayButton
          onClick={() => patchProfile(value ?? '')}
          type="button"
          fullWidth
          className={classNames(
            '!pw-font-medium !pw-py-[11px] !pw-text-xs !pw-leading-[18px] !pw-rounded-full !pw-shadow-[0_2px_4px_#00000042] pw-border-b pw-border-b-[#FFFFFF] pw-cursor-pointer !pw-bg-brand-primary',
            'hover:!pw-shadow-[0_2px_4px_#00000042]',
            'disabled:!pw-bg-[#CCCCCC] disabled:!pw-text-[#959595] disabled:hover:!pw-shadow-[0_2px_4px_#00000042] disabled:pw-cursor-not-allowed'
          )}
        >
          Salvar alterações
        </PixwayButton>
      </div>
    </div>
  );
};
