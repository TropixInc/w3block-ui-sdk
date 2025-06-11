import { lazy, useContext, useMemo } from 'react';

const Box = lazy(() =>
  import('../../../shared/components/Box/Box').then((m) => ({ default: m.Box }))
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
  breakpointsEnum,
  useBreakpoints,
} from '../../../shared/hooks/useBreakpoints/useBreakpoints';
import { ThemeContext } from '../../../storefront/contexts';
const SigInWithoutLayout = lazy(() =>
  import('../../components/SignInWithoutLayout/SignInWithoutLayout').then(
    (module) => ({ default: module.SigInWithoutLayout })
  )
);

const ContainerControllerSDK = lazy(() =>
  import(
    '../../../shared/components/ContainerControllerSDK/ContainerControllerSDK'
  ).then((module) => ({ default: module.ContainerControllerSDK }))
);

interface SignInSignupTemplateSDKProps {
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
  hasSignUp?: boolean;
  extraBy?: ExtraBy[];
  isAppleSignIn?: boolean;
}

export const SignInTemplateSDK = ({
  bgColor,
  infoPosition,
  contentType,
  FAQContext,
  classes,
  separation,
  logoUrl,
  textContainer,
  className,
  hasSignUp = true,
  defaultRedirectRoute = PixwayAppRoutes.COMPLETE_KYC,
  extraBy,
  isAppleSignIn,
}: SignInSignupTemplateSDKProps) => {
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
  const hasSignUpTheme = context?.defaultTheme?.header?.styleData?.hasSignUp;

  return (
    <TranslatableComponent>
      <div style={{ backgroundColor: bgColor }}>
        <ContainerControllerSDK
          fullScreen
          infoPosition={infoPosition}
          bgColor={style?.onBoardingBackgroundColor ?? bgColor}
          contentType={contentType}
          FAQContext={FAQContext}
          classes={classes}
          separation={separation}
          logoUrl={style?.onBoardingLogoSrc?.assetUrl ?? logoUrl}
          textContainer={textContainer}
          className={className}
          extraBy={extraBy}
          infoComponent={
            <Box>
              <SigInWithoutLayout
                hasSignUp={hasSignUpTheme ?? hasSignUp}
                defaultRedirectRoute={defaultRedirectRoute}
                isAppleSignIn={isAppleSignIn}
              ></SigInWithoutLayout>
            </Box>
          }
        />
      </div>
    </TranslatableComponent>
  );
};
