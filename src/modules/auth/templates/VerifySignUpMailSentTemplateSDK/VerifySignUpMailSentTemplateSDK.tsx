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
import { position } from '../../../shared/enums/styleConfigs';
import {
  useBreakpoints,
  breakpointsEnum,
} from '../../../shared/hooks/useBreakpoints/useBreakpoints';
import { ThemeContext } from '../../../storefront/contexts';
const VerifySignUpMailSentWithoutLayout = lazy(() =>
  import('../../components/VerifySignUpMailSentWithoutLayout').then(
    (module) => ({ default: module.VerifySignUpMailSentWithoutLayout })
  )
);

const ContainerControllerSDK = lazy(() =>
  import(
    '../../../shared/components/ContainerControllerSDK/ContainerControllerSDK'
  ).then((module) => ({
    default: module.ContainerControllerSDK,
  }))
);

interface VerifySignUpMailSentTemplateSDKProps {
  email?: string;
  isPostSignUp?: boolean;
  bgColor?: string;
  infoPosition?: position;
  contentType?: ContentTypeEnum;
  FAQContext?: FAQContextEnum;
  classes?: ContainerControllerClasses;
  separation?: boolean;
  logoUrl?: string;
  textContainer?: ContainerTextBesideProps;
  className?: string;
  extraBy?: ExtraBy[];
}

export const VerifySignUpMailSentTemplateSDK = ({
  email,
  isPostSignUp,
  bgColor,
  infoPosition,
  contentType,
  FAQContext,
  classes,
  separation,
  logoUrl,
  textContainer,
  className,
  extraBy,
}: VerifySignUpMailSentTemplateSDKProps) => {
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
        style={{ backgroundColor: style?.onBoardingBackgroundColor ?? bgColor }}
      >
        <ContainerControllerSDK
          bgColor={style?.onBoardingBackgroundColor ?? bgColor}
          infoPosition={infoPosition}
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
              <VerifySignUpMailSentWithoutLayout
                email={email as string}
                isPostSignUp={isPostSignUp}
              />
            </Box>
          }
        />
      </div>
    </TranslatableComponent>
  );
};
