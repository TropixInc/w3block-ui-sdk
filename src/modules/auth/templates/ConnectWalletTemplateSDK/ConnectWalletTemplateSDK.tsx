import { contentTypeEnum } from '../../../poll';
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
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { ConnectExternalWalletWithoutLayout } from '../../components/ConnectExternalWalletWithoutLayout';

interface ConnectWalletTemplateSDKProps {
  bgColor?: string;
  infoPosition?: position;
  contentType?: contentTypeEnum;
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
  defaultRedirectRoute = PixwayAppRoutes.HOME,
  tenantName,
  redirectLink,
  extraBy,
  forceVault,
}: ConnectWalletTemplateSDKProps) => {
  return (
    <TranslatableComponent>
      <div style={{ backgroundColor: bgColor }}>
        <ContainerControllerSDK
          infoPosition={infoPosition}
          contentType={contentType}
          FAQContext={FAQContext}
          classes={classes}
          separation={separation}
          logoUrl={logoUrl}
          textContainer={textContainer}
          className={className}
          bgColor={bgColor}
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
