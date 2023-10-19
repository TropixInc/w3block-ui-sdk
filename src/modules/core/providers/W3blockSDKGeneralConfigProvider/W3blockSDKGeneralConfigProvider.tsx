import { ReactNode, lazy, useMemo } from 'react';

import { withLDProvider } from 'launchdarkly-react-client-sdk';

const CartProvider = lazy(() =>
  import('../../../checkout/providers/cartProvider').then((m) => ({
    default: m.CartProvider,
  }))
);
import { useIsProduction } from '../../../shared/hooks/useIsProduction';
import { PixwayUISdkLocale } from '../../context';
import { EnvironmentContext } from '../../context/EnvironmentContext';
import { W3blockUISDKGereralConfigContext } from '../../context/W3blockUISDKGeneralConfigContext';
const MetamaskProviderUiSDK = lazy(() =>
  import('../../metamask').then((m) => ({ default: m.MetamaskProviderUiSDK }))
);
const SocketProviderUiSDK = lazy(() =>
  import('../../metamask/providers/SocketProviderUiSDK').then((m) => ({
    default: m.SocketProviderUiSDK,
  }))
);
const LocaleProvider = lazy(() =>
  import('../LocaleProvider').then((m) => ({ default: m.LocaleProvider }))
);
const W3blockApiProvider = lazy(() =>
  import('../W3blockApiProvider').then((m) => ({
    default: m.W3blockApiProvider,
  }))
);

interface Props extends JSX.IntrinsicAttributes {
  children: ReactNode;
  api: {
    idUrl: string;
    keyUrl: string;
    commerceUrl: string;
    pdfUrl: string;
    pollUrl?: string;
    passUrl: string;
    directory?: string;
  };
  locale: PixwayUISdkLocale;
  companyId: string;
  logoUrl: string;
  isProduction: boolean;
  appBaseUrl: string;
  connectProxyPass?: string;
  launchDarklyKey?: string;
  name?: string;
}

export const W3blockUISDKGeneralConfig = ({
  children,
  api,
  locale,
  companyId,
  logoUrl,
  isProduction,
  appBaseUrl,
  connectProxyPass = '',
  name = '',
}: Props) => {
  const companyValue = useMemo(
    () => ({ companyId, logoUrl, appBaseUrl, connectProxyPass, name }),
    [logoUrl, companyId, appBaseUrl, connectProxyPass, name]
  );

  const environmentValue = useMemo(
    () => ({
      isProduction,
    }),
    [isProduction]
  );

  return (
    <W3blockUISDKGereralConfigContext.Provider value={companyValue}>
      <EnvironmentContext.Provider value={environmentValue}>
        <W3blockApiProvider
          w3BlockPollApiUrl={api.pollUrl ?? ''}
          w3blockIdAPIUrl={api.idUrl}
          w3blockKeyAPIUrl={api.keyUrl}
          w3blockCommerceAPIUrl={api.commerceUrl}
          w3blockPdfAPIUrl={api.pdfUrl}
          w3BlockPassApiUrl={api.passUrl ?? ''}
        >
          <MetamaskProviderUiSDK>
            <SocketProviderUiSDK>
              <CartProvider>
                <LocaleProvider locale={locale}>{children}</LocaleProvider>
              </CartProvider>
            </SocketProviderUiSDK>
          </MetamaskProviderUiSDK>
        </W3blockApiProvider>
      </EnvironmentContext.Provider>
    </W3blockUISDKGereralConfigContext.Provider>
  );
};

export const W3blockUISDKGeneralConfigProvider = ({
  launchDarklyKey,
  ...props
}: Props) => {
  const isProduction = useIsProduction();
  const LDProvider = useMemo(
    () =>
      withLDProvider<Props>({
        clientSideID: launchDarklyKey
          ? launchDarklyKey
          : isProduction
          ? '636e4bf4ec20a110ee5be93d'
          : '636e4bf4ec20a110ee5be93c',
      })(W3blockUISDKGeneralConfig),
    [isProduction, launchDarklyKey]
  );

  return <LDProvider {...props} />;
};
