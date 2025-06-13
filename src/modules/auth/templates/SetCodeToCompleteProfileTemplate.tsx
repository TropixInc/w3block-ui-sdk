import { useContext, useMemo } from 'react';
import { ContentTypeEnum } from '../../poll/enums/contentType';
import { Box } from '../../shared/components/Box';
import { ContainerControllerClasses, ContainerControllerSDK } from '../../shared/components/ContainerControllerSDK';
import { ContainerTextBesideProps } from '../../shared/components/ContainerTextBeside';
import { ExtraBy } from '../../shared/components/PoweredBy';
import TranslatableComponent from '../../shared/components/TranslatableComponent';
import { breakpointsEnum } from '../../shared/enums/breakpointsEnum';
import { FAQContextEnum } from '../../shared/enums/FAQContext';
import { position } from '../../shared/enums/styleConfigs';
import { useBreakpoints } from '../../shared/hooks/useBreakpoints';
import { ThemeContext } from '../../storefront/contexts/ThemeContext';
import { SetCodeVerify } from '../components/SetCodeVerify';


interface SetCodeToCompleteProfileTemplateProps {
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

export const SetCodeToCompleteProfileTemplate = ({
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
}: SetCodeToCompleteProfileTemplateProps) => {
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
              <SetCodeVerify isPostSignUp={isPostSignUp} />
            </Box>
          }
        />
      </div>
    </TranslatableComponent>
  );
};
