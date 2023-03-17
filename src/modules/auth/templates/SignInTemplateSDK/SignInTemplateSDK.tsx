import { ContentTypeEnum } from '../../../poll';
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
import { SigInWithoutLayout } from '../../components/SignInWithoutLayout/SignInWithoutLayout';

interface SignInSignupTemplateSDKProps {
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
  hasSignUp?: boolean;
  extraBy?: ExtraBy[];
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
  hasSignUp = true,
  defaultRedirectRoute = PixwayAppRoutes.COMPLETE_KYC,
  extraBy,
}: SignInSignupTemplateSDKProps) => {
  return (
    <TranslatableComponent>
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
          extraBy={extraBy}
          infoComponent={
            <Box>
              <SigInWithoutLayout
                hasSignUp={hasSignUp}
                defaultRedirectRoute={defaultRedirectRoute}
              ></SigInWithoutLayout>
            </Box>
          }
        />
      </div>
    </TranslatableComponent>
  );
};
