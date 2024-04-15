/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import { KycStatus } from '@w3block/sdk-id';

import { useGetTheme } from '../../../storefront';
import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { useProfile } from '../../hooks';
import { useCheckWhitelistByUser } from '../../hooks/useCheckWhitelistByUser/useCheckWhitelistByUser';
import { useGetDocuments } from '../../hooks/useGetDocuments';
import { useGetTenantContext } from '../../hooks/useGetTenantContext/useGetTenantContext';
import { useRouterConnect } from '../../hooks/useRouterConnect/useRouterConnect';

export const OnboardContext = createContext({});

const _OnboardProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouterConnect();
  const { data: theme } = useGetTheme();
  const { data: profile } = useProfile();
  const { data: contexts } = useGetTenantContext();
  const query = Object.keys(router.query).length > 0 ? router.query : '';
  const configData = theme?.data?.configurations?.contentData?.onboardConfig;
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

  const { data: checkWhitelists } = useCheckWhitelistByUser(
    whitelists,
    !!whitelists?.length
  );
  const hasAccess = useMemo(() => {
    return checkWhitelists?.details?.filter((res) => res.hasAccess);
  }, [checkWhitelists?.details]);
  const { data: docs, isSuccess, refetch } = useGetDocuments({ limit: 50 });

  const signUpsContexts = useMemo(() => {
    if (contexts) {
      const mainSignUp = contexts?.data?.items?.find(
        ({ context }) => context?.slug === 'signup'
      );
      const alternativesSignUp = contexts?.data?.items?.filter(
        (res) => (res.data as any)?.alternativeSignUp
      );
      if (mainSignUp) {
        alternativesSignUp.push(mainSignUp);
        return alternativesSignUp;
      }
      return alternativesSignUp;
    }
  }, [contexts]);

  const signUpContextsIds = useMemo(() => {
    return signUpsContexts?.map((res) => res.contextId);
  }, [signUpsContexts]);

  const isFilled = useMemo(() => {
    const arr: any[] = [];
    signUpContextsIds?.forEach((response) => {
      if (
        docs?.items?.find(
          (res: { contextId: string }) => res.contextId === response
        )
      )
        arr.push(
          docs?.items?.find(
            (res: { contextId: string }) => res.contextId === response
          )
        );
    });
    return arr;
  }, [docs?.items, signUpContextsIds]);

  const signupContext = useMemo(() => {
    if (contexts) {
      return contexts?.data?.items?.find(
        ({ context }) => context?.slug === 'signup'
      );
    }
  }, [contexts]);

  useEffect(() => {
    if (profile) {
      if (!profile.data.verified) {
        router.pushConnect(PixwayAppRoutes.VERIfY_WITH_CODE, query);
      } else if (signupContext) {
        if (
          profile?.data?.kycStatus === KycStatus.Pending &&
          signupContext.active &&
          !window?.location?.pathname.includes('/auth/complete-kyc') &&
          window?.location?.pathname !== PixwayAppRoutes.SIGN_IN
        ) {
          router.pushConnect(PixwayAppRoutes.COMPLETE_KYC, query);
        }
      }
    }
  }, [profile, query, router, signupContext]);

  const { pushConnect } = router;

  const path = useMemo(() => {
    return router.asPath;
  }, [router.asPath]);

  useEffect(() => {
    if (
      profile &&
      profile?.data?.verified &&
      !(profile?.data?.kycStatus === KycStatus.Pending)
    ) {
      if (
        whitelists?.length > 0 &&
        !(whitelists?.length === isFilled.length - 1) &&
        hasAccess?.length &&
        hasAccess?.length > 0 &&
        !!configData &&
        (!router.asPath.includes('/auth/complete-kyc') ||
          router.asPath.includes('contextSlug=userselector'))
      ) {
        refetch();
      }
    }
  }, [
    configData,
    hasAccess?.length,
    isFilled.length,
    isSuccess,
    profile,
    refetch,
    router.asPath,
    whitelists?.length,
  ]);

  const checkWhite = useCallback(() => {
    if (configData && docs?.items && hasAccess) {
      hasAccess?.every((res) => {
        const whereToSend = Object.values(configData)?.find(
          (d) => (d as any)?.whitelistId === res?.whitelistId
        );

        const docsFilled = docs?.items?.filter(
          (r: { contextId: string }) =>
            r?.contextId === (whereToSend as any)?.contextId
        );

        if (docsFilled?.length === 0) {
          pushConnect((whereToSend as any)?.link);
          return false;
        } else {
          return true;
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configData, docs?.items, hasAccess]);

  useEffect(() => {
    if (path.includes('contextSlug=userselector')) {
      checkWhite();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkWhite, path]);

  useEffect(() => {
    if (
      profile &&
      profile?.data?.verified &&
      !path.includes('/auth/complete-kyc')
    ) {
      checkWhite();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkWhite]);

  return (
    <OnboardContext.Provider value={{}}>{children}</OnboardContext.Provider>
  );
};

export const OnboardProvider = ({ children }: { children: ReactNode }) => {
  return <_OnboardProvider>{children}</_OnboardProvider>;
};
