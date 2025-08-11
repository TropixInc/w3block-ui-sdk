import { useContext, useMemo } from "react";
import { ContentTypeEnum } from "../../poll/enums/contentType";
import { Box } from "../../shared/components/Box";
import { ContainerControllerClasses, ContainerControllerSDK } from "../../shared/components/ContainerControllerSDK";
import { ContainerTextBesideProps } from "../../shared/components/ContainerTextBeside";
import { ExtraBy } from "../../shared/components/PoweredBy";
import TranslatableComponent from "../../shared/components/TranslatableComponent";
import { breakpointsEnum } from "../../shared/enums/breakpointsEnum";
import { FAQContextEnum } from "../../shared/enums/FAQContext";
import { PixwayAppRoutes } from "../../shared/enums/PixwayAppRoutes";
import { position } from "../../shared/enums/styleConfigs";
import { useBreakpoints } from "../../shared/hooks/useBreakpoints";
import { ThemeContext } from "../../storefront/contexts/ThemeContext";
import { ConnectExternalWalletWithoutLayout } from "../components/ConnectExternalWalletWithoutLayout";


interface ConnectWalletTemplateSDKProps {
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
  tenantName?: string;
  extraBy?: ExtraBy[];
  redirectLink?: string;
  forceVault?: boolean;
}

export const ConnectWalletTemplateSDK = ({
  bgColor = 'white',
  infoPosition,
  contentType,
  FAQContext,
  classes,
  separation,
  logoUrl,
  textContainer,
  className,
  defaultRedirectRoute = PixwayAppRoutes.TOKENS,
  tenantName,
  redirectLink,
  extraBy,
  forceVault,
}: ConnectWalletTemplateSDKProps) => {
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
          infoPosition={infoPosition}
          contentType={contentType}
          FAQContext={FAQContext}
          classes={classes}
          separation={separation}
          logoUrl={style?.onBoardingLogoSrc?.assetUrl ?? logoUrl}
          textContainer={textContainer}
          className={className}
          bgColor={style?.onBoardingBackgroundColor ?? bgColor}
          extraBy={extraBy}
          infoComponent={
            <Box>
              <ConnectExternalWalletWithoutLayout
                forceVault={forceVault}
                redirectRoute={defaultRedirectRoute}
                tenantName={tenantName}
                redirectLink={redirectLink}
              />
            </Box>
          }
        />
      </div>
    </TranslatableComponent>
  );
};
