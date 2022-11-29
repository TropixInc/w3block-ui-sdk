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
  return (
    <TranslatableComponent>
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
