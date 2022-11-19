import { useEffect, useRef, useState } from 'react';
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
import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../hooks/useCompanyConfig';
import { usePatchProfile, useProfile } from '../../hooks/useProfile';
import useTranslation from '../../hooks/useTranslation';
import { useUserWallet } from '../../hooks/useUserWallet';
import { Alert } from '../Alert';
import { Link } from '../Link';
import { PixwayButton } from '../PixwayButton';
import { Spinner } from '../Spinner';

export const MyProfile = () => {
  const { data: profile } = useProfile();
  const { connectProxyPass } = useCompanyConfig();
  const [showValue, toggleShowValue] = useToggle(false);
  const [nameVal, setNameVal] = useState('');
  const [translate] = useTranslation();
  const { wallet } = useUserWallet();
  const isLoading = wallet == undefined;

  useEffect(() => {
    setNameVal(profile?.data.name ?? '');
  }, [profile]);

  const { mutate, isSuccess, isLoading: isLoadingPatch } = usePatchProfile();
  const inputRef = useRef<HTMLInputElement>(null);
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
          <Link href={connectProxyPass + PixwayAppRoutes.ADD_FUNDS_TYPE}>
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
      <div className="pw-w-full pw-flex pw-flex-col pw-gap-[34px]">
        <div>
          <p>{translate('shared>myProfile>name')}</p>
          <input
            className="pw-p-[10px] pw-border pw-border-brand-primary pw-w-full pw-rounded-[8px]"
            type="text"
            name="name"
            onChange={(e) => setNameVal(e.target.value)}
            value={nameVal}
            ref={inputRef}
          />
        </div>
        <div>
          <p>E-mail</p>
          <input
            className="pw-p-[10px] pw-border pw-border-brand-primary pw-w-full pw-rounded-[8px] disabled:!pw-bg-[#CCCCCC] disabled:!pw-text-[#131313]"
            type="text"
            disabled
            value={profile?.data.email ?? ''}
          />
        </div>
        <PixwayButton
          onClick={() => mutate(nameVal ?? '')}
          type="button"
          fullWidth
          disabled={isLoadingPatch}
          className={classNames(
            '!pw-font-medium !pw-py-[11px] !pw-text-xs !pw-leading-[18px] !pw-rounded-full !pw-shadow-[0_2px_4px_#00000042] pw-border-b pw-border-b-[#FFFFFF] pw-cursor-pointer !pw-bg-brand-primary !pw-flex !pw-justify-center',
            'hover:!pw-shadow-[0_2px_4px_#00000042]',
            'disabled:!pw-bg-[#CCCCCC] disabled:!pw-text-[#959595] disabled:hover:!pw-shadow-[0_2px_4px_#00000042] disabled:pw-cursor-not-allowed'
          )}
        >
          {isLoadingPatch ? (
            <Spinner className="!pw-h-5 !pw-w-5" />
          ) : (
            'Salvar alterações'
          )}
        </PixwayButton>
      </div>
      {!isLoadingPatch && isSuccess && (
        <Alert variant="success">Seu nome foi alterado com sucesso!</Alert>
      )}
    </div>
  );
};
