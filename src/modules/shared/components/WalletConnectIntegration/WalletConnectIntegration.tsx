import { useMemo, useState } from 'react';
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
import { GetTenantInfoById } from '../../functions/GetTenantInfoById';
import { useHasWallet, useRouterConnect } from '../../hooks';
import { useCreateIntegrationToken } from '../../hooks/useCreateIntegrationToken';
import { useGetAvailableIntegrations } from '../../hooks/useGetAvailableIntegrations';
import { useGetCurrentTenantInfo } from '../../hooks/useGetCurrentTenantInfo';
import { IcompanyInfo } from '../../hooks/useGetTenantInfoById';
import { useGetUserIntegrations } from '../../hooks/useGetUserIntegrations';
import { useIntegrations } from '../../hooks/useIntegrations';
import { usePrivateRoute } from '../../hooks/usePrivateRoute';
import { useProfile } from '../../hooks/useProfile';
import useTranslation from '../../hooks/useTranslation';
import { useUserWallet } from '../../hooks/useUserWallet';
import { InternalPagesLayoutBase } from '../InternalPagesLayoutBase';
import { Link } from '../Link';
import TranslatableComponent from '../TranslatableComponent';
import { WalletConnectDesinModal } from './WalletConnectDesincModal';
import { WalletConnectModal } from './WalletConnectModal';

const _WalletConnectIntegration = () => {
  const { data: profile } = useProfile();
  const { data: integrations } = useIntegrations();
  const { data: tenantIntegrations } = useGetAvailableIntegrations();
  const { data: userIntegrations } = useGetUserIntegrations();
  const { data: currentTenant } = useGetCurrentTenantInfo();
  const router = useRouterConnect();
  const [showValue, toggleShowValue] = useToggle(false);
  const [translate] = useTranslation();
  const { wallet } = useUserWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [isDesincOpen, setIsDesincOpen] = useState(false);
  const isLoading = wallet == undefined;
  const hasWalletConnect = integrations ? integrations.data[0]?.active : false;
  const tenantsAvailable = useMemo(() => {
    const tenants = tenantIntegrations?.data.map(
      ({ toTenantId }) => toTenantId
    );
    return tenants;
  }, [tenantIntegrations?.data]);

  const tenantsData = useMemo(() => {
    const tenantData: IcompanyInfo[] = [];
    tenantsAvailable?.forEach(async (value) => {
      if (!tenantData.some(({ id }) => id === value)) {
        const res = await GetTenantInfoById(value);
        if (res !== undefined) {
          tenantData.push(res);
        }
      }
    });
    return tenantData;
  }, [tenantsAvailable]);

  const integrationsAccepted = useMemo(() => {
    const integrations = userIntegrations?.data?.items.map(
      ({ toTenantId }) => toTenantId
    );
    return integrations;
  }, [userIntegrations?.data?.items]);

  const integrationData = useMemo(() => {
    const tenantData: IcompanyInfo[] = [];
    integrationsAccepted?.forEach(async (value) => {
      if (!tenantData.some(({ id }) => id === value)) {
        const res = await GetTenantInfoById(value);
        if (res !== undefined) {
          tenantData.push(res);
        }
      }
    });
    return tenantData;
  }, [integrationsAccepted]);

  const { mutate: createIntegrationToken } = useCreateIntegrationToken();

  const sincDate = integrations
    ? new Date(integrations.data[0]?.createdAt)
    : new Date();

  const handleClick = () => {
    if (hasWalletConnect) setIsDesincOpen(true);
    else setIsOpen(true);
  };

  const openNewWindow = (path: string) => {
    setTimeout(() => {
      window.open(
        path,
        '_blank',
        'noreferrer,left=600,resizable,width=600,height=900'
      );
    });
  };

  const handleTenantIntegration = ({
    toTenantName,
    toTenantId,
    host,
  }: {
    toTenantName: string;
    toTenantId: string;
    host: string;
  }) => {
    createIntegrationToken(toTenantId ?? '', {
      onSuccess(data) {
        openNewWindow(
          `https://${host}/linkAccount?token=${data.token}&fromEmail=${profile?.data?.email}&fromTentant=${currentTenant?.name}&toTenant=${toTenantName}&toTenantId=${toTenantId}`
        );
        if (!openNewWindow) {
          setTimeout(() => {
            window.open(
              `https://${host}/linkAccount?token=${data.token}&fromEmail=${profile?.data?.email}&fromTentant=${currentTenant?.name}&toTenant=${toTenantName}&toTenantId=${toTenantId}`,
              '_blank',
              'noreferrer'
            );
          });
        }
      },
    });
  };

  const tenantsDataFiltered = tenantsData.filter(
    (value) => !integrationData.some((res) => res.id === value.id)
  );

  return (
    <>
      <div className="pw-w-full pw-flex pw-flex-col pw-gap-[34px] pw-items-start pw-bg-white pw-rounded-[20px] pw-shadow-[2px_2px_10px] pw-shadow-[#00000014] pw-p-[34px]">
        <div className="pw-flex sm:pw-justify-between pw-justify-center pw-items-center pw-w-full">
          <p className="pw-text-2xl pw-font-semibold pw-font-poppins">
            {translate('components>menu>integration')}
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
        <div className="pw-flex pw-flex-row sm:pw-justify-between pw-justify-center pw-items-center pw-w-full">
          <div className="pw-flex pw-flex-col">
            {hasWalletConnect ? (
              <>
                <p className="pw-text-base pw-font-poppins pw-font-medium">
                  {translate('components>walletIntegration>walletConnected')}
                </p>
                <p className="pw-text-sm pw-font-poppins pw-font-normal pw-text-[#777E8F]">
                  {translate('components>walletIntegration>syncDate', {
                    date: sincDate.toLocaleDateString(),
                  })}
                </p>
              </>
            ) : (
              <>
                <p className="pw-text-base pw-font-poppins pw-font-medium">
                  {translate('components>walletIntegration>connectDiscord')}
                </p>
                <p className="pw-text-sm pw-font-poppins pw-font-normal pw-text-[#777E8F]">
                  {translate('components>walletIntegration>connectWallet')}
                </p>
                {wallet?.type === WalletTypes.Metamask && (
                  <p className="pw-text-sm pw-font-poppins pw-font-normal pw-text-[#777E8F]">
                    {translate('components>walletIntegration>connectText')}
                  </p>
                )}
              </>
            )}
          </div>
          <button
            onClick={handleClick}
            className="pw-px-[24px] pw-h-[33px] pw-bg-[#EFEFEF] pw-border-[#295BA6] pw-text-black pw-rounded-[48px] pw-border pw-font-poppins pw-font-medium pw-text-xs"
          >
            {hasWalletConnect
              ? 'Dessincronizar'
              : wallet?.type === WalletTypes.Metamask
              ? translate(
                  'components>walletIntegration>connectTextlearnConnect'
                )
              : translate('components>walletIntegration>connect')}
          </button>
        </div>
        {tenantsDataFiltered.length > 0 && (
          <div className="pw-flex pw-flex-col pw-justify-center pw-items-start pw-gap-3 pw-w-full">
            <p className="pw-text-base pw-font-poppins pw-font-medium">
              Integrações disponíveis
            </p>
            <div className="pw-flex pw-gap-3">
              {tenantsDataFiltered.map(({ name, hosts, id }) => (
                <button
                  key={name}
                  onClick={() =>
                    handleTenantIntegration({
                      host:
                        hosts.find((value) => value.isMain === true)
                          ?.hostname ?? '',
                      toTenantName: name,
                      toTenantId: id,
                    })
                  }
                  className="pw-px-[24px] pw-h-[33px] pw-bg-white pw-shadow-[0_2px_4px_#295BA6] pw-border-[#295BA6] pw-text-black pw-rounded-[48px] pw-border pw-font-poppins pw-font-medium pw-text-xs"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}
        {integrationData.length > 0 && (
          <div className="pw-flex pw-flex-col pw-justify-center pw-items-start pw-gap-3 pw-w-full">
            <p className="pw-text-base pw-font-poppins pw-font-medium">
              Integrações ativas
            </p>
            <div className="pw-flex pw-gap-3">
              {integrationData.map(({ name }) => (
                <button
                  key={name}
                  disabled
                  className="pw-px-[24px] pw-h-[33px] pw-bg-white pw-shadow-[0_2px_4px_#00000042] pw-border-[#295BA6] disabled:pw-border-gray-500 disabled:pw-text-gray-700 pw-rounded-[48px] pw-border pw-font-poppins pw-font-medium pw-text-xs"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <WalletConnectModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <WalletConnectDesinModal
        isOpen={isDesincOpen}
        onClose={() => setIsDesincOpen(false)}
      />
    </>
  );
};

export const WalletConnectIntegration = () => {
  const { isLoading, isAuthorized } = usePrivateRoute();
  useHasWallet({});

  return isLoading || !isAuthorized ? null : (
    <TranslatableComponent>
      <InternalPagesLayoutBase
        classes={{ middleSectionContainer: 'pw-mb-[85px]' }}
      >
        <_WalletConnectIntegration />
      </InternalPagesLayoutBase>
    </TranslatableComponent>
  );
};
