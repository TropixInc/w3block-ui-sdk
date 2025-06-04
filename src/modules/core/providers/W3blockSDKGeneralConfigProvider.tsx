/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSX, ReactNode, lazy, useContext, useMemo } from "react";

import { ErrorProvider } from "./ErrorProvider";
import { LocaleProvider } from "./LocaleProvider";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { PixwayUISdkLocale } from "../context/LocaleContext";
import { W3blockUISDKGereralConfigContext } from "../context/W3blockUISDKGeneralConfigContext";
import { EnvironmentContext } from "../context/EnvironmentContext";
import { W3blockApiProvider } from "./W3blockApiProvider";
import { MetamaskProviderUiSDK } from "../metamask/providers/MetamaskProviderUiSDK";
import { SocketProviderUiSDK } from "../metamask/providers/SocketProviderUiSDK";
import { CartProvider } from "../../checkout/providers/cartProvider";
import { TagManagerProvider } from "../metamask/providers/TagManagerProvider";


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
  logError?(error: any, extra?: object): void;
  gtag?(event: any, params?: object): void;
  client: any;
}


export const W3blockUISDKGeneralConfigProvider = ({
  children,
  api,
  locale,
  companyId,
  logoUrl,
  isProduction,
  appBaseUrl,
  connectProxyPass = "",
  name = "",
  logError,
  gtag,
  client
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

  const queryClient = new QueryClient()

  console.log("cliente atualizado 5")



  return (
    <QueryClientProvider client={queryClient}>
      <W3blockUISDKGereralConfigContext.Provider value={companyValue}>
        <EnvironmentContext.Provider value={environmentValue}>
          <W3blockApiProvider
            w3BlockPollApiUrl={api.pollUrl ?? ""}
            w3blockIdAPIUrl={api.idUrl}
            w3blockKeyAPIUrl={api.keyUrl}
            w3blockCommerceAPIUrl={api.commerceUrl}
            w3blockPdfAPIUrl={api.pdfUrl}
            w3BlockPassApiUrl={api.passUrl ?? ""}
          >
            <MetamaskProviderUiSDK>
              <SocketProviderUiSDK>
                <CartProvider>
                  <TagManagerProvider gtag={gtag}>
                    <ErrorProvider logError={logError}>
                      <LocaleProvider locale={locale}>
                        {children}
                      </LocaleProvider>
                    </ErrorProvider>
                  </TagManagerProvider>
                </CartProvider>
              </SocketProviderUiSDK>
            </MetamaskProviderUiSDK>
          </W3blockApiProvider>
        </EnvironmentContext.Provider>
      </W3blockUISDKGereralConfigContext.Provider>
    </QueryClientProvider>
  );
};
