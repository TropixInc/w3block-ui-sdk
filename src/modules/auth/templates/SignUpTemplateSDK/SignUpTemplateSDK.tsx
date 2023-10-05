import { lazy, useContext, useMemo } from 'react';

import { ContentTypeEnum } from '../../../poll';
import { Box } from '../../../shared/components/Box/Box';
import { ContainerControllerClasses } from '../../../shared/components/ContainerControllerSDK/ContainerControllerSDK';
import { ContainerTextBesideProps } from '../../../shared/components/ContainerTextBeside/ContainerTextBeside';
import { ExtraBy } from '../../../shared/components/PoweredBy/PoweredBy';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { FAQContextEnum } from '../../../shared/enums/FAQContext';
import { position } from '../../../shared/enums/styleConfigs';
import {
  breakpointsEnum,
  useBreakpoints,
} from '../../../shared/hooks/useBreakpoints/useBreakpoints';
import useTranslation from '../../../shared/hooks/useTranslation';
import { ThemeContext } from '../../../storefront/contexts';
import { SignUpFormData } from '../../components/SignUpForm/interface';
import { SignUpFormWithoutLayout } from '../../components/SignUpFormWithoutLayout';

const ContainerControllerSDK = lazy(() =>
  import(
    '../../../shared/components/ContainerControllerSDK/ContainerControllerSDK'
  ).then((module) => ({
    default: module.ContainerControllerSDK,
  }))
);

interface SignUpTemplateSDKProps {
  bgColor?: string;
  infoPosition?: position;
  contentType?: ContentTypeEnum;
  FAQContext?: FAQContextEnum;
  classes?: ContainerControllerClasses;
  separation?: boolean;
  logoUrl?: string;
  textContainer?: ContainerTextBesideProps;
  className?: string;
  onSubmit?: (data: SignUpFormData) => void;
  isLoading?: boolean;
  email?: string;
  error?: string;
  callbackUrl?: string;
  privacyRedirect?: string;
  termsRedirect?: string;
  extraBy?: ExtraBy[];
  hasSignUp?: boolean;
}

export const SignUpTemplateSDK = ({
  bgColor = 'rgba(255,255,255)',
  infoPosition = position.CENTER,
  contentType = ContentTypeEnum.TEXT_LOGO,
  FAQContext,
  separation,
  classes,
  hasSignUp = true,
  logoUrl,
  textContainer,
  className = '',
  onSubmit,
  isLoading = false,
  email,
  error,
  privacyRedirect,
  termsRedirect,
  extraBy,
}: SignUpTemplateSDKProps) => {
  const [translate] = useTranslation();
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
          className={className}
          logoUrl={style?.onBoardingLogoSrc?.assetUrl ?? logoUrl}
          FAQContext={FAQContext}
          classes={classes}
          contentType={contentType}
          bgColor={style?.onBoardingBackgroundColor ?? bgColor}
          infoPosition={infoPosition}
          separation={separation}
          textContainer={textContainer}
          extraBy={extraBy}
          infoComponent={
            <Box>
              <SignUpFormWithoutLayout
                title={translate('singUp>register>phrase')}
                email={email}
                onSubmit={onSubmit}
                isLoading={isLoading}
                hasSignUp={hasSignUp}
                error={error}
                privacyRedirect={style?.privacyPolicy ?? privacyRedirect}
                termsRedirect={style?.termsOfUse ?? termsRedirect}
              />
            </Box>
          }
        />
      </div>
    </TranslatableComponent>
  );
};
