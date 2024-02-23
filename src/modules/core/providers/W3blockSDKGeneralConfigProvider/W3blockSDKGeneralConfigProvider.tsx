import { ReactNode, lazy, useMemo } from 'react';

import { PixwayUISdkLocale } from '../../context';
import { EnvironmentContext } from '../../context/EnvironmentContext';
import { W3blockUISDKGereralConfigContext } from '../../context/W3blockUISDKGeneralConfigContext';
import { ErrorProvider } from '../ErrorProvider/ErrorProvider';
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
const CartProvider = lazy(() =>
  import('../../../checkout/providers/cartProvider').then((m) => ({
    default: m.CartProvider,
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
  name?: string;
  logError?(): void;
}

export const W3blockUISDKGeneralConfigProvider = ({
  children,
  api,
  locale,
  companyId,
  logoUrl,
  isProduction,
  appBaseUrl,
  connectProxyPass = '',
  name = '',
  logError,
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
                <ErrorProvider logError={logError}>
                  <LocaleProvider locale={locale}>{children}</LocaleProvider>
                </ErrorProvider>
              </CartProvider>
            </SocketProviderUiSDK>
          </MetamaskProviderUiSDK>
        </W3blockApiProvider>
      </EnvironmentContext.Provider>
    </W3blockUISDKGereralConfigContext.Provider>
  );
};
