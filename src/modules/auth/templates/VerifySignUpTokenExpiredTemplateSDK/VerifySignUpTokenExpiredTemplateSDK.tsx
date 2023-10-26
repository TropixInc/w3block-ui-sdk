import { lazy, useContext, useMemo } from 'react';

import { position, ExtraBy } from '../../../shared';
const Box = lazy(() =>
  import('../../../shared/components/Box/Box').then((m) => ({ default: m.Box }))
);
import { ContainerControllerClasses } from '../../../shared/components/ContainerControllerSDK/ContainerControllerSDK';
import { ContainerTextBesideProps } from '../../../shared/components/ContainerTextBeside/ContainerTextBeside';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { FAQContextEnum } from '../../../shared/enums/FAQContext';
import {
  useBreakpoints,
  breakpointsEnum,
} from '../../../shared/hooks/useBreakpoints/useBreakpoints';
import { ThemeContext } from '../../../storefront/contexts';
import { ContentTypeEnum } from '../../../poll/enums/contentType';
const VerifySignUpTokenExpiredWithoutLayout = lazy(() =>
  import('../../components/VerifySignUpTokenExpiredWithoutLayout').then(
    (module) => ({ default: module.VerifySignUpTokenExpiredWithoutLayout })
  )
);

const ContainerControllerSDK = lazy(() =>
  import(
    '../../../shared/components/ContainerControllerSDK/ContainerControllerSDK'
  ).then((module) => ({
    default: module.ContainerControllerSDK,
  }))
);

interface VerifySignUpTokenExpired {
  email?: string;
  onSendEmail?: () => void;
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

export const VerifySignUpTokenExpiredTemplateSDK = ({
  email,
  onSendEmail,
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
}: VerifySignUpTokenExpired) => {
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
      <div>
        <ContainerControllerSDK
          bgColor={style?.onBoardingBackgroundColor ?? bgColor}
          infoPosition={infoPosition}
          contentType={contentType}
          FAQContext={FAQContext}
          className={className}
          classes={classes}
          separation={separation}
          logoUrl={style?.onBoardingLogoSrc?.assetUrl ?? logoUrl}
          textContainer={textContainer}
          extraBy={extraBy}
          infoComponent={
            <Box>
              <VerifySignUpTokenExpiredWithoutLayout
                onSendEmail={onSendEmail}
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
