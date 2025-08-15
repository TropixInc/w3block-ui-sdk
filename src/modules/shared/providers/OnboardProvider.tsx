'use client';
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { KycStatus } from '@w3block/sdk-id';

import { Spinner } from '../components/Spinner';
<<<<<<< HEAD
import { PixwayAppRoutes } from '../enums/PixwayAppRoutes';
import { useCheckWhitelistByUser } from '../hooks/useCheckWhitelistByUser';
import { useCompanyConfig } from '../hooks/useCompanyConfig';
import { useGetDocuments } from '../hooks/useGetDocuments';
import { useGetTenantContext } from '../hooks/useGetTenantContext';
import { useProfile } from '../hooks/useProfile';
import { useRouterConnect } from '../hooks/useRouterConnect';
import { createSymlinkSafeContext } from '../utils/createSymlinkSafeContext';
import { removeDoubleSlashesOnUrl } from '../utils/removeDuplicateSlahes';
=======
import { usePathname } from 'next/navigation';


>>>>>>> aa296e7ea17392c8719d9405ce7b3374c582fc28

interface OnboardProps {
  setLoading: (bol: boolean) => void;
  refetchDocs: () => void;
}

export const OnboardContext = createSymlinkSafeContext<OnboardProps>(
  '__ONBOARD_CONTEXT__',
  {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setLoading: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    refetchDocs: () => {},
  }
);

export const OnboardProvider = ({
  children,
  theme,
}: {
  children: ReactNode;
  theme: any;
}) => {
  const router = useRouterConnect();
  const {
    data: profile,
    dataUpdatedAt: profileDataUpdatedAt,
    fetchStatus: isLoadingProfile,
  } = useProfile();
  const { data: contexts } = useGetTenantContext();
  const [loading, setLoading] = useState(false);
  const query = Object.keys(router?.query)?.length > 0 ? router?.query : '';
  const configData = theme?.configurations?.contentData?.onboardConfig;
  const whitelists = useMemo(() => {
    const whitelistsArr: string[] = [];
    if (configData) {
      Object.values(configData)?.forEach((res) => {
        if ((res as any)?.whitelistId) {
          whitelistsArr.push((res as any)?.whitelistId);
        }
      });
    }
    return whitelistsArr;
  }, [configData]);
  const skipWallet = theme?.configurations?.contentData?.skipWallet;
  const { data: checkWhitelists } = useCheckWhitelistByUser(
    whitelists,
    !!whitelists?.length
  );
  const hasAccess = useMemo(() => {
    return checkWhitelists?.details?.filter(
      (res: { hasAccess: any }) => res?.hasAccess
    );
  }, [checkWhitelists?.details]);
  const {
    data: docs,
    refetch,
    isFetching,
    dataUpdatedAt,
  } = useGetDocuments({ limit: 50 });

  const signUpsContexts = useMemo(() => {
    if (contexts) {
      const mainSignUp = contexts?.data?.items?.find(
        ({ context }: any) => context?.slug === 'signup'
      );
      const alternativesSignUp = contexts?.data?.items?.filter(
        (res: { data: any }) => (res.data as any)?.alternativeSignUp
      );
      if (mainSignUp) {
        alternativesSignUp.push(mainSignUp);
        return alternativesSignUp;
      }
      return alternativesSignUp;
    }
  }, [contexts]);

  const signUpContextsIds = useMemo(() => {
    return signUpsContexts?.map((res: { contextId: any }) => res?.contextId);
  }, [signUpsContexts]);

  const isFilled = useMemo(() => {
    const arr: any[] = [];
    signUpContextsIds?.forEach((response: string) => {
      if (
        docs?.items?.find(
          (res: { contextId: string }) => res?.contextId === response
        )
      )
        arr.push(
          docs?.items?.find(
            (res: { contextId: string }) => res?.contextId === response
          )
        );
    });
    return arr;
  }, [docs?.items, signUpContextsIds]);

  const signupContext = useMemo(() => {
    if (contexts) {
      return contexts?.data?.items?.find(
        ({ context }: any) => context?.slug === 'signup'
      );
    }
  }, [contexts]);

  const pathname = usePathname();
  const queryString = new URLSearchParams(router?.query).toString();
  const path = useMemo(() => {
    return pathname + (queryString ? `?${queryString}` : '');
  }, [pathname, queryString]);
  const { connectProxyPass } = useCompanyConfig();
  const callback = () => {
    const url = removeDoubleSlashesOnUrl(
      (location?.hostname?.includes('localhost') ||
      location?.href?.includes('/connect/') ||
      !connectProxyPass
        ? '/'
        : connectProxyPass) + path
    );
    if (router?.query?.callbackPath || router?.query?.callbackUrl) return query;
    else if (
      !location?.href?.includes('/auth/signUp') &&
      !location?.href?.includes('/auth/signIn')
    )
      return { callbackUrl: url };
  };

  useEffect(() => {
    if (profile) {
      if (
        !profile?.data?.verified &&
        !window?.location?.pathname?.includes('/auth/verify-sign-up')
      ) {
        router.pushConnect(PixwayAppRoutes.VERIfY_WITH_CODE, callback());
      } else if (signupContext && isFilled?.length === 0) {
        if (
          profile?.data?.kycStatus === KycStatus.Pending &&
          signupContext?.active &&
          !window?.location?.pathname?.includes('/auth/complete-kyc') &&
          !window?.location?.pathname?.includes('/auth/verify-sign-up') &&
          !window?.location?.pathname?.includes('/auth/signUp') &&
          window?.location?.pathname !== PixwayAppRoutes.SIGN_IN
        ) {
          router.pushConnect(PixwayAppRoutes.COMPLETE_KYC, callback());
        }
      } else if (!skipWallet) {
        if (
          !profile?.data?.mainWallet &&
          !isLoadingProfile &&
          router?.isReady &&
          !window?.location?.pathname?.includes('/auth/complete-kyc') &&
          !window?.location?.pathname?.includes('/auth/verify-sign-up') &&
          !window?.location?.pathname?.includes(
            '/auth/completeSignup/connectExternalWallet'
          )
        ) {
          router.pushConnect(
            PixwayAppRoutes.CONNECT_EXTERNAL_WALLET,
            callback()
          );
        }
      }
    }
  }, [profile, signupContext, profileDataUpdatedAt]);

  const { pushConnect } = router;

  useEffect(() => {
    if (
      profile &&
      profile?.data?.verified &&
      !(profile?.data?.kycStatus === KycStatus.Pending)
    ) {
      if (
        whitelists?.length > 0 &&
        hasAccess?.length &&
        hasAccess?.length > 0 &&
        !!configData &&
        !path?.includes('/auth/complete-kyc')
      ) {
        console.log('refetch');
        refetch();
      } else if (!path?.includes('/auth/complete-kyc')) {
        console.log('setfalse');
        setLoading(false);
      }
    }
  }, [
    configData,
    hasAccess?.length,
    isFilled?.length,
    profile,
    whitelists?.length,
    path,
  ]);

  const filteredWhitelists = useMemo(() => {
    if (configData && hasAccess) {
      return configData?.filter(
        (res: { whitelistId: string }) =>
          hasAccess?.find(
            (r: { whitelistId: string }) => r.whitelistId === res.whitelistId
          )?.hasAccess
      );
    }
  }, [configData, hasAccess]);

  const checkWhite = useCallback(() => {
    try {
      if (filteredWhitelists && docs?.items && hasAccess) {
        let i = 0;
        filteredWhitelists?.every(
          (res: { contextId: string; slug: string }) => {
            const docsFilled = docs?.items?.filter(
              (r: { contextId: string }) => r?.contextId === res?.contextId
            );

            if (docsFilled?.length === 0) {
              console.log('redirect');
              pushConnect(PixwayAppRoutes.COMPLETE_KYC, {
                contextSlug: res?.slug,
              });
              return false;
            } else {
              i++;
              return true;
            }
          }
        );
        if (i === hasAccess?.length) {
          console.log('concluded');
          setLoading(false);
        }
      } else {
        console.log('check else');
        setLoading(false);
      }
    } catch {
      console.log('error');
      setLoading(false);
    }
  }, [filteredWhitelists, docs?.items, hasAccess, dataUpdatedAt]);

  // useEffect(() => {
  //   if (path.includes('contextSlug=userselector')) {
  //     checkWhite();
  //   }
  // }, [checkWhite, path]);

  useEffect(() => {
    if (path?.includes('/auth')) {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    if (
      profile &&
      profile?.data?.verified &&
      (!(profile?.data?.kycStatus === KycStatus.Pending) ||
        !signupContext?.active) &&
      !path?.includes('/auth/complete-kyc')
    ) {
      console.log('trigg checkwhitelists');
      checkWhite();
    }
  }, [checkWhite]);

  return (
    <OnboardContext.Provider value={{ setLoading, refetchDocs: refetch }}>
      {loading || isFetching ? (
        <div className="pw-mt-20 pw-w-full pw-flex pw-items-center pw-justify-center">
          <Spinner />
        </div>
      ) : (
        children
      )}
    </OnboardContext.Provider>
  );
};
