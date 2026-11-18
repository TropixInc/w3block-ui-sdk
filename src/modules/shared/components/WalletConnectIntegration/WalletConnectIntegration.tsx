import { useMemo, useState } from 'react';

import { WalletTypes } from '@w3block/sdk-id';
import classNames from 'classnames';

import { GetTenantInfoById } from '../../functions/GetTenantInfoById';
import { useCreateIntegrationToken } from '../../hooks/useCreateIntegrationToken';
import { useGetAvailableIntegrations } from '../../hooks/useGetAvailableIntegrations';
import { useGetCurrentTenantInfo } from '../../hooks/useGetCurrentTenantInfo';
import { useGetUserIntegrations } from '../../hooks/useGetUserIntegrations';
import { useHasWallet } from '../../hooks/useHasWallet';
import { useIntegrations } from '../../hooks/useIntegrations';
import { usePrivateRoute } from '../../hooks/usePrivateRoute';
import { useProfile } from '../../hooks/useProfile';
import useTranslation from '../../hooks/useTranslation';
import { useUserWallet } from '../../hooks/useUserWallet/useUserWallet';
import { ICompanyInfo } from '../../interfaces/ICompanyInfo';
import { ErrorBox } from '../ErrorBox';
import { InternalPagesLayoutBase } from '../InternalPagesLayoutBase';
import TranslatableComponent from '../TranslatableComponent';
import { PageHeader } from '../ui/PageHeader';
import { SectionCard } from '../ui/SectionCard';
import { StatusPill } from '../ui/StatusPill';
import { UI } from '../ui/tokens';
import { WalletConnectDesinModal } from './WalletConnectDesincModal';
import { WalletConnectModal } from './WalletConnectModal';

/**
 * Conexões: WalletConnect (Discord) sync and the cross-tenant account
 * integrations. Same hooks and flows as before, only the chrome changed.
 */
const _WalletConnectIntegration = () => {
  const { data: profile, error: errorProfile } = useProfile();
  const { data: integrations, error: errorIntegrations } = useIntegrations();
  const { data: tenantIntegrations, error: errorTenantIntegrations } =
    useGetAvailableIntegrations();
  const { data: userIntegrations, error: errorUserIntegrations } =
    useGetUserIntegrations();
  const { data: currentTenant, error: errorCurrentTenant } =
    useGetCurrentTenantInfo();

  const [translate] = useTranslation();
  const { mainWallet: wallet } = useUserWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [isDesincOpen, setIsDesincOpen] = useState(false);

  const hasWalletConnect = integrations ? integrations.data[0]?.active : false;

  const tenantsAvailable = useMemo(() => {
    return tenantIntegrations?.data.map(({ toTenantId }) => toTenantId);
  }, [tenantIntegrations?.data]);

  const tenantsData = useMemo(() => {
    const tenantData: ICompanyInfo[] = [];
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
    return userIntegrations?.data?.items.map(({ toTenantId }) => toTenantId);
  }, [userIntegrations?.data?.items]);

  const integrationData = useMemo(() => {
    const tenantData: ICompanyInfo[] = [];
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
        const url = `https://${host}/linkAccount?token=${data.token}&fromEmail=${profile?.data?.email}&fromTentant=${currentTenant?.name}&toTenant=${toTenantName}&toTenantId=${toTenantId}`;
        openNewWindow(url);
        if (!openNewWindow) {
          setTimeout(() => {
            window.open(url, '_blank', 'noreferrer');
          });
        }
      },
    });
  };

  const tenantsDataFiltered = tenantsData.filter(
    (value) => !integrationData.some((res) => res.id === value.id)
  );

  if (
    errorProfile ||
    errorIntegrations ||
    errorTenantIntegrations ||
    errorUserIntegrations ||
    errorCurrentTenant
  ) {
    return (
      <>
        <ErrorBox customError={errorProfile} />
        <ErrorBox customError={errorIntegrations} />
        <ErrorBox customError={errorTenantIntegrations} />
        <ErrorBox customError={errorUserIntegrations} />
        <ErrorBox customError={errorCurrentTenant} />
      </>
    );
  }

  return (
    <div className="pw-flex pw-flex-col pw-gap-4 pw-px-4 sm:pw-px-0">
      <PageHeader
        title={translate('components>menu>integration')}
        subtitle={translate('shared>walletConnectIntegration>subtitle')}
      />
      <SectionCard>
        <div className="pw-flex pw-flex-col sm:pw-flex-row sm:pw-items-center pw-justify-between pw-gap-3">
          <div className="pw-min-w-0">
            <div className="pw-flex pw-items-center pw-gap-2 pw-flex-wrap">
              <p
                className={classNames(
                  'pw-text-[14px] pw-font-semibold pw-m-0',
                  UI.text
                )}
              >
                {hasWalletConnect
                  ? translate('components>walletIntegration>walletConnected')
                  : translate('components>walletIntegration>connectDiscord')}
              </p>
              <StatusPill tone={hasWalletConnect ? 'ok' : 'grey'} size="sm">
                {hasWalletConnect
                  ? translate('shared>walletConnectIntegration>connected')
                  : translate('shared>walletConnectIntegration>notConnected')}
              </StatusPill>
            </div>
            <p
              className={classNames(
                'pw-text-[12.5px] pw-m-0 pw-mt-0.5',
                UI.textMuted
              )}
            >
              {hasWalletConnect
                ? translate('components>walletIntegration>syncDate', {
                    date: sincDate.toLocaleDateString(),
                  })
                : translate('components>walletIntegration>connectWallet')}
            </p>
            {!hasWalletConnect && wallet?.type === WalletTypes.Metamask ? (
              <p
                className={classNames(
                  'pw-text-[12.5px] pw-m-0 pw-mt-0.5',
                  UI.textMuted
                )}
              >
                {translate('components>walletIntegration>connectText')}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={handleClick}
            className={classNames(UI.buttonSecondary, 'pw-shrink-0')}
          >
            {hasWalletConnect
              ? translate('components>walletIntegration>disconnect')
              : wallet?.type === WalletTypes.Metamask
              ? translate(
                  'components>walletIntegration>connectTextlearnConnect'
                )
              : translate('components>walletIntegration>connect')}
          </button>
        </div>
      </SectionCard>

      {tenantsDataFiltered.length > 0 ? (
        <SectionCard
          title={translate(
            'shared>walletConnectIntegration>avaliableIntegration'
          )}
        >
          <div className="pw-flex pw-flex-wrap pw-gap-2">
            {tenantsDataFiltered.map(({ name, hosts, id }) => (
              <button
                key={name}
                type="button"
                onClick={() =>
                  handleTenantIntegration({
                    host:
                      hosts.find((value) => value.isMain === true)?.hostname ??
                      '',
                    toTenantName: name,
                    toTenantId: id,
                  })
                }
                className={UI.buttonSecondary}
              >
                {name}
              </button>
            ))}
          </div>
        </SectionCard>
      ) : null}

      {integrationData.length > 0 ? (
        <SectionCard
          title={translate('shared>walletConnectIntegration>activeIntegration')}
        >
          <div className="pw-flex pw-flex-wrap pw-gap-2">
            {integrationData.map(({ name }) => (
              <StatusPill key={name} tone="ok">
                {name}
              </StatusPill>
            ))}
          </div>
        </SectionCard>
      ) : null}

      <WalletConnectModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <WalletConnectDesinModal
        isOpen={isDesincOpen}
        onClose={() => setIsDesincOpen(false)}
      />
    </div>
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
