import { useContext, useMemo } from 'react';

import { ContainerControllerSDK } from '../../../shared';
import { Box } from '../../../shared/components/Box/Box';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import {
  useBreakpoints,
  breakpointsEnum,
} from '../../../shared/hooks/useBreakpoints/useBreakpoints';
import { ThemeContext } from '../../../storefront/contexts';
import { ResetPasswordWithoutLayout } from '../../components/ResetPasswordWithoutLayout';
import { AllAuthPageProps } from '../CompleteProfileCustomTemplate';

export const ResetPasswordTemplateSDK = (props: AllAuthPageProps) => {
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
      <div
        style={{
          backgroundColor: style?.onBoardingBackgroundColor ?? props.bgColor,
        }}
      >
        <ContainerControllerSDK
          infoPosition={props.infoPosition}
          textContainer={props.textContainer}
          FAQContext={props.FAQContext}
          bgColor={style?.onBoardingBackgroundColor ?? props.bgColor}
          separation={props.separation}
          extraBy={props.extraBy}
          className={props.className}
          classes={props.classes}
          logoUrl={style?.onBoardingLogoSrc?.assetUrl ?? props.logoUrl}
          infoComponent={
            <Box>
              <ResetPasswordWithoutLayout />
            </Box>
          }
        />
      </div>
    </TranslatableComponent>
  );
};
