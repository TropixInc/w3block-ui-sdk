import { useEffect } from 'react';
import { Trans } from 'react-i18next';

import classNames from 'classnames';

import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import useTranslation from '../../../shared/hooks/useTranslation';
import { removeDoubleSlashesOnUrl } from '../../../shared/utils/removeDuplicateSlahes';
import MailError from '../../assets/icons/mailError.svg?react';
import { useRequestConfirmationMail } from '../../hooks/useRequestConfirmationMail';
import { AuthFooter } from '../AuthFooter';
import { AuthLayoutBase, AuthLayoutBaseClasses } from '../AuthLayoutBase';

interface Props {
  email: string;
  onSendEmail?: () => void;
  tenantId?: string;
  classes?: AuthLayoutBaseClasses;
  isPostSignUp?: boolean;
}

export const VerifySignUpTokenExpired = ({
  email,
  onSendEmail,
  tenantId,
  classes = {},
  isPostSignUp = false,
}: Props) => {
  const { logoUrl, connectProxyPass, appBaseUrl } = useCompanyConfig();
  const { mutate, isLoading, isSuccess, isError } =
    useRequestConfirmationMail();
  const [translate] = useTranslation();

  useEffect(() => {
    if (isSuccess && onSendEmail) onSendEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const callbackPath = removeDoubleSlashesOnUrl(
    appBaseUrl +
      connectProxyPass +
      (isPostSignUp
        ? PixwayAppRoutes.COMPLETE_SIGNUP
        : PixwayAppRoutes.SIGN_UP_MAIL_CONFIRMATION)
  );

  return (
    <AuthLayoutBase
      classes={{
        root: classNames('!pw-px-5 sm:!pw-px-5', classes.root ?? ''),
        contentContainer: classNames(
          '!pw-pt-0 sm:!pw-pt-[35px] sm:!pw-px-[35px] !pw-shadow-none sm:!pw-shadow-[1px_1px_10px_rgba(0,0,0,0.2)] !pw-bg-transparent sm:!pw-bg-white !pw-px-0 sm:!pw-px-[35px] !pw-max-w-none sm:!pw-max-w-[514px]',
          classes.contentContainer ?? ''
        ),
        logo: classNames('w-[130px] h-[130px]', classes.logo ?? ''),
        title: classNames('pw-px-2 sm:pw-px-0', classes.title ?? ''),
      }}
      logo={logoUrl}
      title={translate('auth>expiredLink>stepTitle')}
    >
      <div className="pw-flex pw-items-center pw-flex-col pw-mt-6">
        <p className="pw-text-[#353945] pw-text-[13px] pw-leading-[15.85px] pw-mb-6">
          {translate('auth>expiredLink>linkNotValidatedMessage')}
        </p>

        <span className="pw-text-brand-primary pw-text-sm pw-leading-[21px]">
          <Trans
            i18nKey={
              isPostSignUp
                ? 'auth>emailConfirmation>resendCodeAction'
                : 'auth>emailConfirmation>resendEmailAction'
            }
          >
            <button
              onClick={() => mutate({ email, tenantId, callbackPath })}
              disabled={isLoading}
              className="pw-mb-[29px] pw-font-semibold pw-text-sm pw-leading-[17px] pw-text-brand-primary pw-underline"
            >
              Clique aqui
            </button>
            para reenviar seu código.
          </Trans>
        </span>

        <div className="pw-mb-6">
          <MailError className="pw-w-[187px] pw-h-[187px]" />
        </div>
        {isError && (
          <p className="pw-mt-4 pw-text-sm pw-text-red-500">
            Erro ao enviar código, por favor entre em contato com o suporte
          </p>
        )}
        <AuthFooter />
      </div>
    </AuthLayoutBase>
  );
};
