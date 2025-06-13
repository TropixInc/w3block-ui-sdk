import { lazy, useContext, useMemo } from 'react';
import { ExtraBy } from '../../shared/components/PoweredBy';
import { position } from '../../shared/enums/styleConfigs';
import { ContentTypeEnum } from '../../poll/enums/contentType';
import { FAQContextEnum } from '../../shared/enums/FAQContext';
import { ContainerControllerClasses, ContainerControllerSDK } from '../../shared/components/ContainerControllerSDK';
import { ContainerTextBesideProps } from '../../shared/components/ContainerTextBeside';
import { ThemeContext } from '../../storefront/contexts/ThemeContext';
import { useBreakpoints } from '../../shared/hooks/useBreakpoints';
import { breakpointsEnum } from '../../shared/enums/breakpointsEnum';
import TranslatableComponent from '../../shared/components/TranslatableComponent';
import { Box } from '../../shared/components/Box';
import { CompleteSignUpSuccessWithoutLayout } from '../components/CompleteSignUpSuccessWithoutLayout';


interface CompleteSignUpSuccessTemplateSDKProps {
  extraBy?: ExtraBy[];
  bgColor?: string;
  infoPosition?: position;
  contentType?: ContentTypeEnum;
  FAQContext?: FAQContextEnum;
  classes?: ContainerControllerClasses;
  logoUrl?: string;
  textContainer?: ContainerTextBesideProps;
  className?: string;
}

export const CompleteSignUpSuccessTemplateSDK = ({
  extraBy,
  bgColor,
  infoPosition,
  contentType,
  FAQContext,
  classes,
  logoUrl,
  textContainer,
  className,
}: CompleteSignUpSuccessTemplateSDKProps) => {
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
  return (
    <TranslatableComponent>
      <ContainerControllerSDK
        extraBy={extraBy}
        bgColor={style?.onBoardingBackgroundColor ?? bgColor}
        infoPosition={infoPosition}
        contentType={contentType}
        FAQContext={FAQContext}
        classes={classes}
        separation={false}
        logoUrl={style?.onBoardingLogoSrc?.assetUrl ?? logoUrl}
        textContainer={textContainer}
        className={className}
        infoComponent={
          <Box>
            <CompleteSignUpSuccessWithoutLayout />
          </Box>
        }
      />
    </TranslatableComponent>
  );
};
