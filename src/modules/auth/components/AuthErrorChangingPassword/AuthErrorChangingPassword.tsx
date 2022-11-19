import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useRouterPushConnect } from '../../../shared/hooks/useRouterPushConnect';
import useTranslation from '../../../shared/hooks/useTranslation';
import { ReactComponent as ErrorFilled } from '../../assets/icons/errorFilled.svg';
import { AuthButton } from '../AuthButton';
import { AuthFooter } from '../AuthFooter';
import { AuthLayoutBase } from '../AuthLayoutBase';

interface Props {
  onRetry: () => void;
}

export const AuthErrorChagingPassword = ({ onRetry }: Props) => {
  const router = useRouterPushConnect();
  const { logoUrl } = useCompanyConfig();
  const [translate] = useTranslation();
  return (
    <AuthLayoutBase
      title=""
      logo={logoUrl}
      classes={{
        root: '!pw-px-[26px] sm:!pw-px-5 !pw-pt-[63px] lg:!pw-pt-[28px]',
        contentContainer:
          '!pw-pt-0 sm:!pw-pt-[35px] sm:!pw-px-[35px] !pw-shadow-none sm:!pw-shadow-[1px_1px_10px_rgba(0,0,0,0.2)] !pw-bg-transparent sm:!pw-bg-white !pw-px-0 !pw-max-w-none sm:!pw-max-w-[514px]',
        logo: 'w-[130px] h-[130px]',
      }}
    >
      <div className="pw-pt-0 pw-pb-6 sm:pw-my-6">
        <ErrorFilled className="pw-fill-[#ED4971] pw-w-9 pw-h-9 pw-mx-auto mb-6" />
        <h1 className="pw-font-bold pw-text-2xl pw-leading-[29px] pw-text-[#35394C] pw-text-center pw-mb-6 pw-px-4 sm:pw-px-20">
          {translate('changePassword>error>errorChangingPassword')}
        </h1>
        <div className="pw-flex pw-items-center pw-gap-x-6">
          <AuthButton
            className="!pw-bg-[#EFEFEF] !pw-border !pw-border-[#DCDCDC] !pw-text-[#090909] !pw-shadow-none"
            onClick={() => router.push(PixwayAppRoutes.HOME)}
            fullWidth
          >
            {translate('components>cancelMessage>cancel')}
          </AuthButton>
          <AuthButton onClick={onRetry} fullWidth>
            {translate('components>advanceButton>continue')}
          </AuthButton>
        </div>
      </div>
      <AuthFooter />
    </AuthLayoutBase>
  );
};
