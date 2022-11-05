import { contentTypeEnum } from '../../../poll';
import {
  ContainerControllerClasses,
  ContainerControllerSDK,
  position,
} from '../../../shared';
import { Box } from '../../../shared/components/Box/Box';
import { ContainerTextBesideProps } from '../../../shared/components/ContainerTextBeside/ContainerTextBeside';
import { FAQContextEnum } from '../../../shared/enums/FAQContext';
import { VerifySignUpMailSentWithoutLayout } from '../../components/VerifySignUpMailSentWithoutLayout';

interface VerifySignUpMailSentTemplateSDKProps {
  email?: string;
  isPostSignUp?: boolean;
  bgColor?: string;
  infoPosition?: position;
  contentType?: contentTypeEnum;
  FAQContext?: FAQContextEnum;
  classes?: ContainerControllerClasses;
  separation?: boolean;
  logoUrl?: string;
  textContainer?: ContainerTextBesideProps;
  className?: string;
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
}: VerifySignUpMailSentTemplateSDKProps) => {
  return (
    <div style={{ backgroundColor: bgColor }}>
      <ContainerControllerSDK
        bgColor={bgColor}
        infoPosition={infoPosition}
        contentType={contentType}
        FAQContext={FAQContext}
        classes={classes}
        separation={separation}
        logoUrl={logoUrl}
        textContainer={textContainer}
        className={className}
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
  );
};
