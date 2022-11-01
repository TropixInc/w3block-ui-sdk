import { contentTypeEnum } from '../../../poll';
import {
  ContainerControllerClasses,
  ContainerControllerSDK,
  position,
  PoweredBy,
} from '../../../shared';
import { Box } from '../../../shared/components/Box/Box';
import { ContainerTextBesideProps } from '../../../shared/components/ContainerTextBeside/ContainerTextBeside';
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
}: ConnectWalletTemplateSDKProps) => {
  return (
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
        infoComponent={
          <Box>
            <ConnectExternalWalletWithoutLayout
              redirectRoute={defaultRedirectRoute}
            />
          </Box>
        }
      />
      <PoweredBy
        logoColor="white"
        PwPosition={position.RIGHT}
        classes={{ title: 'pw-text-white' }}
      />
    </div>
  );
};
