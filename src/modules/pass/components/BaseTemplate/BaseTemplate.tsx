/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode } from 'react';
import { Trans } from 'react-i18next';
import { useToggle } from 'react-use';

import { WalletTypes } from '@w3block/sdk-id';
import classNames from 'classnames';

import { useProfile } from '../../../shared';
import CashIcon from '../../../shared/assets/icons/cashFilled.svg?react';
import EyeIcon from '../../../shared/assets/icons/eyeIcon.svg?react';
import EyeCrossedIcon from '../../../shared/assets/icons/eyeIconCrossed.svg?react';
import MetamaskIcon from '../../../shared/assets/icons/metamask.svg?react';
import WalletIcon from '../../../shared/assets/icons/walletOutlined.svg?react';
import useTranslation from '../../../shared/hooks/useTranslation';
import { useUserWallet } from '../../../shared/hooks/useUserWallet';
import { Chip } from './Chip';

export const BaseTemplate = ({
  children,
  classes,
  title,
}: {
  title: string;
  children: ReactNode;
  classes?: {
    modal?: string;
    title?: string;
  };
}) => {
  const [translate] = useTranslation();
  const [showValue, toggleShowValue] = useToggle(false);
  const { data: profile } = useProfile();
  const { mainWallet: wallet } = useUserWallet();
  const walletBalance = wallet?.balance ?? '0';
  const isLoading = wallet == undefined;

  return (
    <div
      className={classNames(
        classes?.modal
          ? classes.modal
          : 'pw-bg-white pw-flex pw-flex-col pw-gap-[20px] sm:pw-gap-[32px] sm:pw-rounded-[20px] pw-p-0 sm:pw-p-[24px] sm:pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] pw-mb-[100px]'
      )}
    >
      <div className="pw-flex">
        <div
          className={classNames(
            classes?.title
              ? classes.title
              : 'pw-w-full pw-text-center pw-font-bold pw-text-[18px] pw-leading-[23px] sm:pw-hidden pw-mb-[30px]'
          )}
        >
          {title}
        </div>
        <div className="pw-w-full pw-items-center pw-justify-between pw-hidden sm:pw-flex">
          <span className="pw-font-semibold pw-text-[23px] pw-leading-[32px]">
            {title}
          </span>
          <div className="pw-flex pw-items-center pw-gap-4">
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
              <Chip.Skeleton />
            ) : (
              profile?.data.wallets?.map((wallet) => {
                return wallet.type === WalletTypes.Vault ? (
                  <Chip
                    key={wallet.id}
                    showValue={showValue}
                    value={walletBalance}
                    Icon={() => (
                      <WalletIcon className="pw-stroke-brand-primary" />
                    )}
                    title={translate('wallet>page>balance')}
                  />
                ) : (
                  <Chip
                    key={wallet.id}
                    showValue={showValue}
                    value={walletBalance}
                    Icon={() => (
                      <MetamaskIcon className="pw-stroke-brand-primary" />
                    )}
                    title={translate('wallet>page>metamask')}
                  />
                );
              })
            )}
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
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};
