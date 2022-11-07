import { contentTypeEnum } from '../../../poll';
import {
  ContainerControllerSDK,
  position,
  ContainerControllerClasses,
} from '../../../shared';
import { Box } from '../../../shared/components/Box/Box';
import { ContainerTextBesideProps } from '../../../shared/components/ContainerTextBeside/ContainerTextBeside';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { FAQContextEnum } from '../../../shared/enums/FAQContext';
import useTranslation from '../../../shared/hooks/useTranslation';
import { SignUpFormData } from '../../components/SignUpForm/interface';
import { SignUpFormWithoutLayout } from '../../components/SignUpFormWithoutLayout';

interface SignUpTemplateSDKProps {
  bgColor?: string;
  infoPosition?: position;
  contentType?: contentTypeEnum;
  FAQContext?: FAQContextEnum;
  classes?: ContainerControllerClasses;
  separation?: boolean;
  logoUrl?: string;
  textContainer?: ContainerTextBesideProps;
  className?: string;
  onSubmit: (data: SignUpFormData) => void;
  isLoading: boolean;
  email?: string;
  error?: string;
  privacyRedirect?: string;
  termsRedirect?: string;
}

export const SignUpTemplateSDK = ({
  bgColor = 'rgba(255,255,255)',
  infoPosition = position.CENTER,
  contentType = contentTypeEnum.TEXT_LOGO,
  FAQContext,
  separation,
  classes,
  logoUrl,
  textContainer,
  className = '',
  onSubmit,
  isLoading = false,
  email,
  error,
  privacyRedirect,
  termsRedirect,
}: SignUpTemplateSDKProps) => {
  const [translate] = useTranslation();
  return (
    <TranslatableComponent>
      <div style={{ backgroundColor: bgColor }}>
        <ContainerControllerSDK
          className={className}
          logoUrl={logoUrl}
          FAQContext={FAQContext}
          classes={classes}
          contentType={contentType}
          bgColor={bgColor}
          infoPosition={infoPosition}
          separation={separation}
          textContainer={textContainer}
          infoComponent={
            <Box>
              <SignUpFormWithoutLayout
                title={translate('singUp>register>phrase')}
                email={email}
                onSubmit={onSubmit}
                isLoading={isLoading}
                error={error}
                privacyRedirect={privacyRedirect}
                termsRedirect={termsRedirect}
              />
            </Box>
          }
        />
      </div>
    </TranslatableComponent>
  );
};
