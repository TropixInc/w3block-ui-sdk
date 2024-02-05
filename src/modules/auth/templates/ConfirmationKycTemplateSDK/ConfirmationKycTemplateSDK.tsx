import { lazy, useContext, useEffect, useMemo } from 'react';

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
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { position } from '../../../shared/enums/styleConfigs';
import {
  useBreakpoints,
  breakpointsEnum,
} from '../../../shared/hooks/useBreakpoints/useBreakpoints';
import { useGetTenantContextBySlug } from '../../../shared/hooks/useGetTenantContextBySlug/useGetTenantContextBySlug';
import { usePixwaySession } from '../../../shared/hooks/usePixwaySession';
import { useProfile } from '../../../shared/hooks/useProfile/useProfile';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect/useRouterConnect';
import { ThemeContext } from '../../../storefront/contexts';
import { ConfirmationKycWithoutLayout } from '../../components/ConfirmationKycWithoutLayout';

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
  const { data: kycContext } = useGetTenantContextBySlug(
    router?.query?.contextSlug as string
  );
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
