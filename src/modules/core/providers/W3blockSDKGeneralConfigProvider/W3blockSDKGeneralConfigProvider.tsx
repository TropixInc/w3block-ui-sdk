import { ReactNode, useMemo } from 'react';

import { PixwayUISdkLocale } from '../../context';
import { W3blockUISDKGereralConfigContext } from '../../context/W3blockUISDKGeneralConfigContext';
import { LocaleProvider } from '../LocaleProvider';
import { W3blockApiProvider } from '../W3blockApiProvider';
import { W3blockResendConfirmEmailProvider } from '../W3blockResendConfirmEmailProvider';

interface Props {
  children: ReactNode;
  api: {
    idUrl: string;
    keyUrl: string;
  };
  locale: PixwayUISdkLocale;
  companyId: string;
  logoUrl: string;
}

export const W3blockUISDKGeneralConfigProvider = ({
  children,
  api,
  locale,
  companyId,
  logoUrl,
}: Props) => {
  const value = useMemo(() => ({ companyId, logoUrl }), [logoUrl, companyId]);
  return (
    <W3blockUISDKGereralConfigContext.Provider value={value}>
      <W3blockApiProvider
        w3blockIdAPIUrl={api.idUrl}
        w3blockKeyAPIUrl={api.keyUrl}
      >
        <LocaleProvider locale={locale}>
          <W3blockResendConfirmEmailProvider>
            {children}
          </W3blockResendConfirmEmailProvider>
        </LocaleProvider>
      </W3blockApiProvider>
    </W3blockUISDKGereralConfigContext.Provider>
  );
};
