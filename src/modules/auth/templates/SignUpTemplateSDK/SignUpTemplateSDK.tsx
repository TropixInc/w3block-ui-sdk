import { contentTypeEnum } from '../../../poll';
import {
  ContainerControllerSDK,
  PoweredBy,
  position,
  ContainerControllerClasses,
} from '../../../shared';
import { Box } from '../../../shared/components/Box/Box';
import { ContainerTextBesideProps } from '../../../shared/components/ContainerTextBeside/ContainerTextBeside';
import { FAQContextEnum } from '../../../shared/enums/FAQContext';
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
}: SignUpTemplateSDKProps) => {
  return (
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
              title="Faça o seu cadastro"
              email={email}
              onSubmit={onSubmit}
              isLoading={isLoading}
              error={error}
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
