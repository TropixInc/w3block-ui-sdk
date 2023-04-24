import { useContext, useMemo } from 'react';

import { ContentTypeEnum } from '../../../poll';
import {
  ContainerControllerClasses,
  ContainerControllerSDK,
  ExtraBy,
  position,
} from '../../../shared';
import { Box } from '../../../shared/components/Box/Box';
import { ContainerTextBesideProps } from '../../../shared/components/ContainerTextBeside/ContainerTextBeside';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { FAQContextEnum } from '../../../shared/enums/FAQContext';
import {
  useBreakpoints,
  breakpointsEnum,
} from '../../../shared/hooks/useBreakpoints/useBreakpoints';
import { ThemeContext } from '../../../storefront/contexts';
import { CompleteSignUpSuccessWithoutLayout } from '../../components/CompleteSignUpSuccessWithoutLayout';

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
