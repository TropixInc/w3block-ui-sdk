import { ReactNode, useMemo } from 'react';

import { PixwayUISdkLocale } from '../../context';
import { EnvironmentContext } from '../../context/EnvironmentContext';
import { W3blockUISDKGereralConfigContext } from '../../context/W3blockUISDKGeneralConfigContext';
import { LocaleProvider } from '../LocaleProvider';
import { W3blockApiProvider } from '../W3blockApiProvider';

interface Props {
  children: ReactNode;
  api: {
    idUrl: string;
    keyUrl: string;
    baseUrl: string;
  };
  locale: PixwayUISdkLocale;
  companyId: string;
  logoUrl: string;
  isProduction: boolean;
  appBaseUrl: string;
}

export const W3blockUISDKGeneralConfigProvider = ({
  children,
  api,
  locale,
  companyId,
  logoUrl,
  isProduction,
  appBaseUrl,
}: Props) => {
  const companyValue = useMemo(
    () => ({ companyId, logoUrl, appBaseUrl }),
    [logoUrl, companyId, appBaseUrl]
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
          w3blockIdAPIUrl={api.idUrl}
          w3blockKeyAPIUrl={api.keyUrl}
          w3blockIdBaseUrl={api.baseUrl}
        >
          <LocaleProvider locale={locale}>{children}</LocaleProvider>
        </W3blockApiProvider>
      </EnvironmentContext.Provider>
    </W3blockUISDKGereralConfigContext.Provider>
  );
};
