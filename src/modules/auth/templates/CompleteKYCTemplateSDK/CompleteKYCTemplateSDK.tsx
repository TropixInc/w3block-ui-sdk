import { lazy, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage } from 'react-use';

import { KycStatus } from '@w3block/sdk-id';

const ContainerControllerSDK = lazy(() =>
  import(
    '../../../shared/components/ContainerControllerSDK/ContainerControllerSDK'
  ).then((m) => ({ default: m.ContainerControllerSDK }))
);

const Spinner = lazy(() =>
  import('../../../shared/components/Spinner').then((m) => ({
    default: m.Spinner,
  }))
);
import { ContentTypeEnum } from '../../../poll/enums/contentType';
import { ContainerControllerClasses } from '../../../shared/components/ContainerControllerSDK/ContainerControllerSDK';
import { ContainerTextBesideProps } from '../../../shared/components/ContainerTextBeside/ContainerTextBeside';
import { ExtraBy } from '../../../shared/components/PoweredBy/PoweredBy';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { FAQContextEnum } from '../../../shared/enums/FAQContext';
import { LocalStorageFields } from '../../../shared/enums/LocalStorageFields';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { position } from '../../../shared/enums/styleConfigs';
import {
  useBreakpoints,
  breakpointsEnum,
} from '../../../shared/hooks/useBreakpoints/useBreakpoints';
import { usePixwaySession } from '../../../shared/hooks/usePixwaySession';
import { useProfile } from '../../../shared/hooks/useProfile/useProfile';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect/useRouterConnect';
import { ThemeContext } from '../../../storefront/contexts';
const FormCompleteKYCWithoutLayout = lazy(() =>
  import('../../components/FormCompleteKYCWithoutLayout').then((m) => ({
    default: m.FormCompleteKYCWithoutLayout,
  }))
);

interface CompleteKYCTemplateSDKProps {
  bgColor?: string;
  infoPosition?: position;
  contentType?: ContentTypeEnum;
  FAQContext?: FAQContextEnum;
  classes?: ContainerControllerClasses;
  separation?: boolean;
  logoUrl?: string;
  textContainer?: ContainerTextBesideProps;
  className?: string;
  defaultRedirectRoute?: string;
  tenantName?: string;
  extraBy?: ExtraBy[];
  redirectLink?: string;
}

export const CompleteKYCTemplateSDK = ({
  bgColor = 'white',
  infoPosition,
  contentType,
  FAQContext,
  classes,
  separation,
  logoUrl,
  textContainer,
  defaultRedirectRoute = PixwayAppRoutes.CONNECT_EXTERNAL_WALLET,
  className,
  extraBy,
}: CompleteKYCTemplateSDKProps) => {
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const router = useRouterConnect();
  const { status } = usePixwaySession();
  const { data: session } = usePixwaySession();
  const [callbackUrl, setCallbackUrl] = useLocalStorage<string>(
    LocalStorageFields.AUTHENTICATION_CALLBACK,
    ''
  );

  const query = Object.keys(router.query).length > 0 ? router.query : '';

  useEffect(() => {
    if (session && profile?.data) {
      const { data: user } = profile;
      if (user.kycStatus !== KycStatus.Pending && !router.query.contextSlug) {
        router.pushConnect(getRedirectUrl(), query);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, router, profile]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.pushConnect(PixwayAppRoutes.SIGN_IN, query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const checkForCallbackUrl = () => {
    if (!profile?.data.mainWallet) {
      return PixwayAppRoutes.CONNECT_EXTERNAL_WALLET;
    } else if (callbackUrl) {
      const url = callbackUrl;
      setCallbackUrl('');
      return url;
    }
  };

  const getRedirectUrl = () => checkForCallbackUrl() ?? defaultRedirectRoute;

  const context = useContext(ThemeContext);
  const breakpoint = useBreakpoints();
  const mobileBreakpoints = [breakpointsEnum.SM, breakpointsEnum.XS];
  const style = useMemo(() => {
    if (context && context.defaultTheme) {
      const configStyleData = context.defaultTheme?.configurations?.styleData;
      const configMobileStyleData =
        context.defaultTheme?.configurations?.mobileStyleData;
      const mergedConfigStyleData = mobileBreakpoints.includes(breakpoint)
        ? { ...configStyleData, ...configMobileStyleData }
        : configStyleData;
      return mergedConfigStyleData;
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]);

  return isLoadingProfile ? (
    <div
      style={{ backgroundColor: style?.onBoardingBackgroundColor ?? bgColor }}
      className="pw-w-full pw-h-screen pw-flex pw-justify-center pw-items-center"
    >
      <Spinner />
    </div>
  ) : profile && profile?.data?.kycStatus !== KycStatus.NoRequired ? (
    <TranslatableComponent>
      <div
        style={{ backgroundColor: style?.onBoardingBackgroundColor ?? bgColor }}
      >
        <ContainerControllerSDK
          infoPosition={infoPosition}
          contentType={contentType}
          FAQContext={FAQContext}
          classes={classes}
          separation={separation}
          logoUrl={style?.onBoardingLogoSrc?.assetUrl ?? logoUrl}
          textContainer={textContainer}
          className={className}
          bgColor={style?.onBoardingBackgroundColor ?? bgColor}
          extraBy={extraBy}
          infoComponent={
            <FormCompleteKYCWithoutLayout userId={profile?.data?.id} />
          }
        />
      </div>
    </TranslatableComponent>
  ) : null;
};
