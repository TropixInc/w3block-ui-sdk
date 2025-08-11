import { lazy, useContext, useEffect, useMemo } from 'react';
import { position } from '../../shared/enums/styleConfigs';
import { ContentTypeEnum } from '../../poll/enums/contentType';
import { FAQContextEnum } from '../../shared/enums/FAQContext';
import { ContainerControllerClasses, ContainerControllerSDK } from '../../shared/components/ContainerControllerSDK';
import { ContainerTextBesideProps } from '../../shared/components/ContainerTextBeside';
import { ExtraBy } from '../../shared/components/PoweredBy';
import { useProfile } from '../../shared/hooks/useProfile';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { usePixwaySession } from '../../shared/hooks/usePixwaySession';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { ThemeContext } from '../../storefront/contexts/ThemeContext';
import { useBreakpoints } from '../../shared/hooks/useBreakpoints';
import { breakpointsEnum } from '../../shared/enums/breakpointsEnum';
import { Spinner } from '../../shared/components/Spinner';
import TranslatableComponent from '../../shared/components/TranslatableComponent';

import { useGetTenantContextBySlug } from '../../shared/hooks/useGetTenantContextBySlug';
import { ConfirmationKycWithoutLayout } from '../components/ConfirmationKycWithoutLayout';



interface ConfirmationKycTemplateSDKProps {
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

export const ConfirmationKycTemplateSDK = ({
  bgColor = 'white',
  infoPosition,
  contentType,
  FAQContext,
  classes,
  separation,
  logoUrl,
  textContainer,
  className,
  extraBy,
}: ConfirmationKycTemplateSDKProps) => {
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const router = useRouterConnect();
  const { status } = usePixwaySession();
  const query = Object.keys(router.query).length > 0 ? router.query : '';
  const slug = () => {
    const querySlug = router?.query?.contextSlug;
    if (querySlug) return querySlug as string;
    else return 'signup';
  };
  const { data: kycContext } = useGetTenantContextBySlug(slug());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const screenConfig = (kycContext?.data as any)?.data?.screenConfig;
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.pushConnect(PixwayAppRoutes.SIGN_IN, query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

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
  ) : profile ? (
    <TranslatableComponent>
      <div
        style={{ backgroundColor: style?.onBoardingBackgroundColor ?? bgColor }}
      >
        <ContainerControllerSDK
          infoPosition={
            screenConfig?.position ? screenConfig?.position : infoPosition
          }
          contentType={
            screenConfig?.contentType ? screenConfig?.contentType : contentType
          }
          FAQContext={FAQContext}
          classes={classes}
          separation={separation}
          logoUrl={style?.onBoardingLogoSrc?.assetUrl ?? logoUrl}
          textContainer={
            screenConfig?.textContainer
              ? screenConfig?.textContainer
              : textContainer
          }
          className={className}
          bgColor={style?.onBoardingBackgroundColor ?? bgColor}
          extraBy={extraBy}
          infoComponent={<ConfirmationKycWithoutLayout />}
        />
      </div>
    </TranslatableComponent>
  ) : null;
};
