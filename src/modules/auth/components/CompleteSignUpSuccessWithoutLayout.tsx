import { lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { AuthButton } from './AuthButton';


export const CompleteSignUpSuccessWithoutLayout = () => {
  const router = useRouterConnect();
  const [translate] = useTranslation();
  return (
    <div className="pw-text-[#35394C] sm:!pw-mt-6">
      <h1 className="pw-mb-6 pw-text-center pw-text-2xl pw-leading-[29px] pw-font-bold px- sm:pw-px-0">
        {translate('companyAuth>signUp>accountCreated')}
      </h1>
      <p className="pw-text-center pw-mb-6 pw-text-sm sm:pw-text-[13px] pw-leading-[15px] sm:pw-leading-[17px] pw-px-[70px] sm:pw-px-0">
        {translate('auth>completeSignUp>mailAlreadyVerified')}
      </p>

      <AuthButton
        fullWidth
        className="pw-mb-6"
        onClick={() => router.push(PixwayAppRoutes.HOME)}
      >
        {translate('loginPage>formSubmitButton>signIn')}
      </AuthButton>
    </div>
  );
};
