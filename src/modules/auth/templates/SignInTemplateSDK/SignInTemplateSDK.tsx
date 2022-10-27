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
import { SigInWithoutLayout } from '../../components/SignInWithoutLayout/SignInWithoutLayout';

interface SignInSignupTemplateSDKProps {
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

export const SignInTemplateSDK = ({
  bgColor,
  infoPosition,
  contentType,
  FAQContext,
  classes,
  separation,
  logoUrl,
  textContainer,
  className,
  defaultRedirectRoute = PixwayAppRoutes.CONNECT_EXTERNAL_WALLET,
}: SignInSignupTemplateSDKProps) => {
  return (
    <div style={{ backgroundColor: bgColor }}>
      <ContainerControllerSDK
        fullScreen
        infoPosition={infoPosition}
        bgColor={bgColor}
        contentType={contentType}
        FAQContext={FAQContext}
        classes={classes}
        separation={separation}
        logoUrl={logoUrl}
        textContainer={textContainer}
        className={className}
        infoComponent={
          <Box>
            <SigInWithoutLayout
              defaultRedirectRoute={defaultRedirectRoute}
            ></SigInWithoutLayout>
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
