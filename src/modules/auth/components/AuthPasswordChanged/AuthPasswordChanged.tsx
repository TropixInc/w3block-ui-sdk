import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import useRouter from '../../../shared/hooks/useRouter';
import useTranslation from '../../../shared/hooks/useTranslation';
import { AuthButton } from '../AuthButton';
import { AuthFooter } from '../AuthFooter';
import { AuthLayoutBase } from '../AuthLayoutBase';

export const AuthPasswordChanged = () => {
  const router = useRouter();
  const { logoUrl } = useCompanyConfig();
  const [translate] = useTranslation();
  return (
    <AuthLayoutBase
      title={translate('companyAuth>resetPassword>passwordChangedSuccessfully')}
      logo={logoUrl}
    >
      <div className="pw-my-6">
        <AuthButton onClick={() => router.push(PixwayAppRoutes.HOME)} fullWidth>
          {translate('components>advanceButton>continue')}
        </AuthButton>
      </div>
      <AuthFooter />
    </AuthLayoutBase>
  );
};
