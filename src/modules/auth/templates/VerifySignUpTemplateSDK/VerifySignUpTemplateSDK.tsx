import { lazy, useEffect, useState } from 'react';
import { useDebounce } from 'react-use';

import isAfter from 'date-fns/isAfter';

import { ContentTypeEnum } from '../../../poll/enums/contentType';
import { ContainerControllerClasses } from '../../../shared/components/ContainerControllerSDK/ContainerControllerSDK';
import { ContainerTextBesideProps } from '../../../shared/components/ContainerTextBeside/ContainerTextBeside';
import { ExtraBy } from '../../../shared/components/PoweredBy/PoweredBy';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { FAQContextEnum } from '../../../shared/enums/FAQContext';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { position } from '../../../shared/enums/styleConfigs';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import { useVerifySignUp } from '../../hooks/useVerifySignUp';
const CompleteSignUpSuccessTemplateSDK = lazy(() =>
  import('../CompleteSignUpSuccessTemplateSDK').then((m) => ({
    default: m.CompleteSignUpSuccessTemplateSDK,
  }))
);
const VerifySignUpMailSentTemplateSDK = lazy(() =>
  import('../VerifySignUpMailSentTemplateSDK').then((m) => ({
    default: m.VerifySignUpMailSentTemplateSDK,
  }))
);
const VerifySignUpTokenExpiredTemplateSDK = lazy(() =>
  import('../VerifySignUpTokenExpiredTemplateSDK').then((m) => ({
    default: m.VerifySignUpTokenExpiredTemplateSDK,
  }))
);

enum Steps {
  LOADING = 1,
  EMAIL_VERIFIED,
  TOKEN_EXPIRED,
  EMAIL_SENT,
}

interface VerifySignUpTemplateSDKProps {
  classes?: ContainerControllerClasses;
  extraBy?: ExtraBy[];
  bgColor?: string;
  infoPosition?: position;
  contentType?: ContentTypeEnum;
  FAQContext?: FAQContextEnum;
  separation?: boolean;
  logoUrl?: string;
  textContainer?: ContainerTextBesideProps;
  className?: string;
}

const TIME_TO_REDIRECT_TO_HOME = 6000;

const _VerifySignUpTemplateSDK = ({
  extraBy,
  classes,
  bgColor,
  infoPosition,
  contentType,
  FAQContext,
  separation,
  logoUrl,
  textContainer,
  className,
}: VerifySignUpTemplateSDKProps) => {
  const { mutate, isLoading, isSuccess, isError } = useVerifySignUp();
  const router = useRouterConnect();
  const { email, token } = router.query;
  const [step, setStep] = useState(Steps.LOADING);
  const emailToUse = email ? decodeURIComponent(email as string) : '';

  const [_, cancel] = useDebounce(
    () => {
      if (step === Steps.EMAIL_VERIFIED) {
        router.pushConnect(PixwayAppRoutes.SIGN_IN);
      }
    },
    TIME_TO_REDIRECT_TO_HOME,
    [step]
  );

  useEffect(() => {
    if (step) setStep(Steps.LOADING);
    return cancel;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if ((!token || !email) && router.isReady && step === Steps.LOADING) {
      router.push(PixwayAppRoutes.HOME);
    }
  }, [token, email, router, step]);

  useEffect(() => {
    if (isSuccess && step !== Steps.EMAIL_VERIFIED) {
      setStep(Steps.EMAIL_VERIFIED);
    }
  }, [isSuccess, step, setStep]);

  useEffect(() => {
    if (isError && step !== Steps.TOKEN_EXPIRED) {
      setStep(Steps.TOKEN_EXPIRED);
    }
  }, [isError, step, setStep]);

  useEffect(() => {
    if (
      router.isReady &&
      email &&
      token &&
      !Array.isArray(email) &&
      !Array.isArray(token) &&
      step === Steps.LOADING
    ) {
      const tokenSplitted = token.split(';');
      if (tokenSplitted.length !== 2) router.push(PixwayAppRoutes.HOME);
      else {
        const timeStamp = Number(tokenSplitted[1]);
        if (isAfter(new Date(), new Date(timeStamp)))
          setStep(Steps.TOKEN_EXPIRED);
        else if (!isLoading && !isError)
          mutate({ email: email as string, token: token as string });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutate, email, token, router]);

  if (step === Steps.TOKEN_EXPIRED)
    return (
      <VerifySignUpTokenExpiredTemplateSDK
        email={emailToUse.replaceAll(' ', '+') ?? ''}
        onSendEmail={() => setStep(Steps.EMAIL_SENT)}
        extraBy={extraBy}
        FAQContext={FAQContext}
        bgColor={bgColor}
        className={className}
        classes={classes}
        contentType={contentType}
        infoPosition={infoPosition}
        logoUrl={logoUrl}
        separation={separation}
        textContainer={textContainer}
      />
    );

  if (step === Steps.EMAIL_SENT)
    return (
      <VerifySignUpMailSentTemplateSDK
        FAQContext={FAQContext}
        bgColor={bgColor}
        className={className}
        classes={classes}
        contentType={contentType}
        infoPosition={infoPosition}
        logoUrl={logoUrl}
        separation={separation}
        textContainer={textContainer}
        extraBy={extraBy}
        email={emailToUse.replaceAll(' ', '+') ?? ''}
      />
    );

  return isLoading || !step || step === Steps.LOADING ? null : (
    <CompleteSignUpSuccessTemplateSDK
      FAQContext={FAQContext}
      bgColor={bgColor}
      className={className}
      classes={classes}
      contentType={contentType}
      infoPosition={infoPosition}
      logoUrl={logoUrl}
      textContainer={textContainer}
      extraBy={extraBy}
    />
  );
};

export const VerifySignUpTemplateSDK = (
  props: VerifySignUpTemplateSDKProps
) => (
  <TranslatableComponent>
    <_VerifySignUpTemplateSDK {...props} />
  </TranslatableComponent>
);
