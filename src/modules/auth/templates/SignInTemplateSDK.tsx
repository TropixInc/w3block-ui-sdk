import { lazy, useContext, useMemo } from 'react';
import { position } from '../../shared/enums/styleConfigs';
import { ContentTypeEnum } from '../../poll/enums/contentType';
import { FAQContextEnum } from '../../shared/enums/FAQContext';
import { ContainerControllerClasses, ContainerControllerSDK } from '../../shared/components/ContainerControllerSDK';
import { ContainerTextBesideProps } from '../../shared/components/ContainerTextBeside';
import { ExtraBy } from '../../shared/components/PoweredBy';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { ThemeContext } from '../../storefront/contexts/ThemeContext';
import { useBreakpoints } from '../../shared/hooks/useBreakpoints';
import { breakpointsEnum } from '../../shared/enums/breakpointsEnum';
import TranslatableComponent from '../../shared/components/TranslatableComponent';
import { Box } from '../../shared/components/Box';
import { SigInWithoutLayout } from '../components/SignInWithoutLayout';



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
              ></SigInWithoutLayout>
            </Box>
          }
        />
      </div>
    </TranslatableComponent>
  );
};
