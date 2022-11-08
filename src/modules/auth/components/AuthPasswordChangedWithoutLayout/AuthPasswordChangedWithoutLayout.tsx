import { ReactComponent as CheckCircleOutlined } from '../../../shared/assets/icons/checkCircledOutlined.svg';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import useRouter from '../../../shared/hooks/useRouter';
import useTranslation from '../../../shared/hooks/useTranslation';
import { AuthButton } from '../AuthButton';

export const AuthPasswordChangedWithoutLayout = () => {
  const router = useRouter();

  const [translate] = useTranslation();
  return (
    <div className="pw-pt-0 pw-pb-6 sm:pw-my-6">
      <CheckCircleOutlined className="pw-stroke-[#76DE8D] pw-w-9 pw-h-9 pw-mx-auto mb-6" />
      <h1 className="pw-font-bold pw-text-2xl pw-leading-[29px] pw-text-[#35394C] pw-text-center pw-mb-6 pw-px-11 sm:pw-px-0">
        {translate('companyAuth>resetPassword>passwordChangedSuccessfully')}
      </h1>
      <AuthButton
        onClick={() => router.push(PixwayAppRoutes.SIGN_IN)}
        fullWidth
      >
        {translate('components>advanceButton>continue')}
      </AuthButton>
    </div>
  );
};
