import { useEffect, useState } from 'react';

import { isAfter } from 'date-fns';

import { contentTypeEnum } from '../../../poll';
import { ContainerControllerClasses, position } from '../../../shared';
import { ContainerTextBesideProps } from '../../../shared/components/ContainerTextBeside/ContainerTextBeside';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { FAQContextEnum } from '../../../shared/enums/FAQContext';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import useRouter from '../../../shared/hooks/useRouter';
import useTranslation from '../../../shared/hooks/useTranslation';
import { AuthLayoutBaseClasses } from '../../components/AuthLayoutBase';
import { SignUpFormData } from '../../components/SignUpForm/interface';
import { useChangePassword } from '../../hooks/useChangePassword';
import { CompleteSigUpSuccessTemplateSDK } from '../CompleteSignUpSuccessTemplateSDK';
import { SignUpTemplateSDK } from '../SignUpTemplateSDK/SignUpTemplateSDK';
import { VerifySignUpMailSentTemplateSDK } from '../VerifySignUpMailSentTemplateSDK';
import { VerifySignUpTokenExpiredTemplateSDK } from '../VerifySignUpTokenExpiredTemplateSDK';

enum Steps {
  FORM = 1,
  TOKEN_EXPIRED,
  CONFIRMATION_MAIL_SENT,
  MAIL_CONFIRMED,
}

export interface AllAuthPageProps {
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

interface CompleteProfileCustomTemplateProps {
  classes?: AuthLayoutBaseClasses;
  signUpProps?: AllAuthPageProps;
  verifyEmailProps?: AllAuthPageProps;
}

const getIsTokenExpired = (token: string) => {
  const tokenSplitted = token.split(';');
  if (tokenSplitted.length !== 2) {
    return true;
  }
  return isAfter(new Date(), new Date(Number(tokenSplitted[1])));
};

const _CompleteProfileCustomTemplate = ({
  signUpProps,
  verifyEmailProps,
}: CompleteProfileCustomTemplateProps) => {
  const router = useRouter();
  const [translate] = useTranslation();
  const { email, token } = router.query;
  const { mutate, isLoading, isSuccess, isError } = useChangePassword();
  const [step, setStep] = useState(() => {
    return token && getIsTokenExpired(token as string)
      ? Steps.TOKEN_EXPIRED
      : Steps.FORM;
  });

  useEffect(() => {
    if (isSuccess) router.push(PixwayAppRoutes.CONNECT_EXTERNAL_WALLET);
  }, [isSuccess]);

  useEffect(() => {
    if (isError) setStep(Steps.TOKEN_EXPIRED);
  }, [isError]);

  useEffect(() => {
    if ((!token || !email) && router.isReady) {
      router.push(PixwayAppRoutes.HOME);
    }
  }, [token, email, router]);

  useEffect(() => {
    if (token && getIsTokenExpired(token as string)) {
      setStep(Steps.TOKEN_EXPIRED);
    }
  }, [token]);

  const onSubmit = ({ confirmation, password }: SignUpFormData) => {
    mutate({
      email: email as string,
      password,
      confirmation,
      token: token as string,
    });
  };

  if (step === Steps.TOKEN_EXPIRED)
    return (
      <VerifySignUpTokenExpiredTemplateSDK
        email={email as string}
        onSendEmail={() => setStep(Steps.CONFIRMATION_MAIL_SENT)}
        isPostSignUp
        {...verifyEmailProps}
      />
    );

  if (step === Steps.CONFIRMATION_MAIL_SENT)
    return (
      <VerifySignUpMailSentTemplateSDK
        {...verifyEmailProps}
        email={email as string}
        isPostSignUp
      />
    );

  return step === Steps.FORM ? (
    <SignUpTemplateSDK
      {...signUpProps}
      email={email as string}
      isLoading={isLoading}
      onSubmit={onSubmit}
      error={
        isError ? translate('auth>signUpError>genericErrorMessage') : undefined
      }
    />
  ) : (
    <CompleteSigUpSuccessTemplateSDK {...verifyEmailProps} />
  );
};

export const CompleteProfileCustomTemplate = (
  props: CompleteProfileCustomTemplateProps
) => {
  return (
    <TranslatableComponent>
      <_CompleteProfileCustomTemplate {...props} />
    </TranslatableComponent>
  );
};
