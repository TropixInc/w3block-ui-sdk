import { lazy, useContext, useMemo } from 'react';

import { Box } from '../../../shared/components/Box/Box';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import {
  useBreakpoints,
  breakpointsEnum,
} from '../../../shared/hooks/useBreakpoints/useBreakpoints';
import { ThemeContext } from '../../../storefront/contexts';
import { RequestPasswordChangeWithoutLayout } from '../../components/RequestPasswordChangeWithoutLayout';
import { AllAuthPageProps } from '../CompleteProfileCustomTemplate';
const ContainerControllerSDK = lazy(() =>
  import(
    '../../../shared/components/ContainerControllerSDK/ContainerControllerSDK'
  ).then((module) => ({
    default: module.ContainerControllerSDK,
  }))
);

export const RequestChangePasswordTemplateSDK = (props: AllAuthPageProps) => {
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
          fullScreen
          contentType={props.contentType}
          textContainer={props.textContainer}
          FAQContext={props.FAQContext}
          separation={props.separation}
          className={props.className}
          classes={props.classes}
          bgColor={style?.onBoardingBackgroundColor ?? props.bgColor}
          infoPosition={props.infoPosition}
          logoUrl={style?.onBoardingLogoSrc?.assetUrl ?? props.logoUrl}
          extraBy={props.extraBy}
          infoComponent={
            <Box>
              <RequestPasswordChangeWithoutLayout hasSignUp={props.hasSignUp} />
            </Box>
          }
        />
      </div>
    </TranslatableComponent>
  );
};
