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
import { VerifySignUpTokenExpiredWithoutLayout } from '../../components/VerifySignUpTokenExpiredWithoutLayout/VerifySignUpTokenExpiredWithoutLayout';

interface VerifySignUpTokenExpired {
  email?: string;
  onSendEmail?: () => void;
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
}: VerifySignUpTokenExpired) => {
  return (
    <div>
      <ContainerControllerSDK
        bgColor={bgColor}
        infoPosition={infoPosition}
        contentType={contentType}
        FAQContext={FAQContext}
        className={className}
        classes={classes}
        separation={separation}
        logoUrl={logoUrl}
        textContainer={textContainer}
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
      <PoweredBy
        PwPosition={position.RIGHT}
        logoColor="white"
        classes={{ title: 'pw-text-white' }}
      />
    </div>
  );
};
