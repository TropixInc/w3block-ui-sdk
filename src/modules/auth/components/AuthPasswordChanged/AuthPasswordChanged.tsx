import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import useRouter from '../../../shared/hooks/useRouter';
import useTranslation from '../../../shared/hooks/useTranslation';
import { AuthButton } from '../AuthButton';
import { AuthFooter } from '../AuthFooter';
import { AuthLayoutBase } from '../AuthLayoutBase';

export const CompanyAuthPasswordChanged = () => {
  const router = useRouter();
  const [translate] = useTranslation();
  return (
    <AuthLayoutBase
      title={translate('companyAuth>resetPassword>passwordChangedSuccessfully')}
      logo=""
    >
      <div className="pw-my-6">
        <h1 className="pw-text-xl pw-leading-[23px] pw-text-[#353945] pw-font-bold pw-mb-6 sm:pw-text-2xl sm:pw-leading-7 pw-text-center">
          {translate('companyAuth>resetPassword>passwordChangedSuccessfully')}
        </h1>
        <AuthButton onClick={() => router.push(PixwayAppRoutes.HOME)} fullWidth>
          {translate('components>advanceButton>continue')}
        </AuthButton>
      </div>
      <AuthFooter />
    </AuthLayoutBase>
  );
};
