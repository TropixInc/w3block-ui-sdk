import { lazy, useEffect, useState } from 'react';

import isAfter from 'date-fns/isAfter';
import { position } from '../../shared/enums/styleConfigs';
import { ContentTypeEnum } from '../../poll/enums/contentType';
import { FAQContextEnum } from '../../shared/enums/FAQContext';
import { ContainerControllerClasses } from '../../shared/components/ContainerControllerSDK';
import { ContainerTextBesideProps } from '../../shared/components/ContainerTextBeside';
import { ExtraBy } from '../../shared/components/PoweredBy';
import { AuthLayoutBaseClasses } from '../components/AuthLayoutBase';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { useTranslation } from 'react-i18next';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { useChangePassword } from '../hooks/useChangePassword';
import { usePixwayAuthentication } from '../hooks/usePixwayAuthentication';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { SignUpFormData } from '../interface/SignUpFormData';
import { VerifySignUpTokenExpiredTemplateSDK } from './VerifySignUpTokenExpiredTemplateSDK';
import { VerifySignUpMailSentTemplateSDK } from './VerifySignUpMailSentTemplateSDK';
import { SignUpTemplateSDK } from './SignUpTemplateSDK';
import { CompleteSignUpSuccessTemplateSDK } from './CompleteSignUpSuccessTemplateSDK';
import TranslatableComponent from '../../shared/components/TranslatableComponent';



enum Steps {
  FORM = 1,
  TOKEN_EXPIRED,
  CONFIRMATION_MAIL_SENT,
  MAIL_CONFIRMED,
}

export interface AllAuthPageProps {
  bgColor?: string;
  hasSignUp?: boolean;
  infoPosition?: position;
  contentType?: ContentTypeEnum;
  FAQContext?: FAQContextEnum;
  classes?: ContainerControllerClasses;
  separation?: boolean;
  logoUrl?: string;
  textContainer?: ContainerTextBesideProps;
  className?: string;
  extraBy?: ExtraBy[];
}

interface CompleteProfileCustomTemplateProps {
  classes?: AuthLayoutBaseClasses;
  signUpProps?: AllAuthPageProps;
  verifyEmailProps?: AllAuthPageProps;
  extraBy?: ExtraBy[];
}

const getIsTokenExpired = (token: string) => {
  const tokenSplitted = decodeURIComponent(token).split(';');
  if (tokenSplitted.length !== 2) {
    return true;
  }
  return isAfter(new Date(), new Date(Number(tokenSplitted[1])));
};

const _CompleteProfileCustomTemplate = ({
  signUpProps,
  verifyEmailProps,
  extraBy,
}: CompleteProfileCustomTemplateProps) => {
  const router = useRouterConnect();
  const [translate] = useTranslation();
  const { companyId } = useCompanyConfig();
  const { email, token } = router.query;
  const { mutate, isLoading, isError } = useChangePassword();
  const { signIn } = usePixwayAuthentication();
  const [step, setStep] = useState(() => {
    return token && getIsTokenExpired(token as string)
      ? Steps.TOKEN_EXPIRED
      : Steps.FORM;
  });

  const emailToUse = email ? decodeURIComponent(email as string) : '';

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
    {
      mutate(
        {
          email: emailToUse.replaceAll(' ', '+'),
          password,
          confirmation,
          token: (token as string).split(';')[0],
        },
        {
          onSuccess() {
            signIn({
              email: emailToUse.replaceAll(' ', '+'),
              password,
              companyId,
            })
              .then(() => router.pushConnect(PixwayAppRoutes.COMPLETE_KYC))
              .catch((e) => {
                // eslint-disable-next-line no-console
                console.log(e);
              });
          },
        }
      );
    }
  };

  if (step === Steps.TOKEN_EXPIRED)
    return (
      <VerifySignUpTokenExpiredTemplateSDK
        email={emailToUse.replaceAll(' ', '+') ?? ''}
        onSendEmail={() => setStep(Steps.CONFIRMATION_MAIL_SENT)}
        isPostSignUp={!email}
        extraBy={extraBy}
        {...verifyEmailProps}
      />
    );

  if (step === Steps.CONFIRMATION_MAIL_SENT)
    return (
      <VerifySignUpMailSentTemplateSDK
        {...verifyEmailProps}
        extraBy={extraBy}
        email={emailToUse.replaceAll(' ', '+') ?? ''}
        isPostSignUp={!email}
      />
    );

  return step === Steps.FORM ? (
    <SignUpTemplateSDK
      {...signUpProps}
      email={emailToUse.replaceAll(' ', '+') ?? ''}
      isLoading={isLoading}
      onSubmit={onSubmit}
      extraBy={extraBy}
      error={
        isError ? translate('auth>signUpError>genericErrorMessage') : undefined
      }
    />
  ) : (
    <CompleteSignUpSuccessTemplateSDK {...verifyEmailProps} extraBy={extraBy} />
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
