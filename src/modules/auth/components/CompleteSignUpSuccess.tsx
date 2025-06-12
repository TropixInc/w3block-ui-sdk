import classNames from 'classnames';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { usePixwayAuthentication } from '../hooks/usePixwayAuthentication';
import { AuthButton } from './AuthButton';
import { AuthFooter } from './AuthFooter';
import { AuthLayoutBaseClasses, AuthLayoutBase } from './AuthLayoutBase';
import useTranslation from '../../shared/hooks/useTranslation';


interface Props {
  classes?: AuthLayoutBaseClasses;
  handleContinue?: () => void;
}

export const CompleteSignUpSuccess = ({
  classes = {},
  handleContinue,
}: Props) => {
  const { logoUrl } = useCompanyConfig();
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const { signOut } = usePixwayAuthentication();

  const handleContinueInside = () => {
    if (handleContinue) {
      handleContinue();
    } else {
      signOut().then(() => {
        router.pushConnect(PixwayAppRoutes.SIGN_IN);
      });
    }
  };

  return (
    <AuthLayoutBase
      logo={logoUrl}
      title={translate('auth>signUpForm>formTitle')}
      classes={{
        contentContainer: classNames(
          'pw-px-[15px] pw-pt-[35px] pw-pb-[39px] sm:!pw-p-[35px]',
          classes?.contentContainer ?? ''
        ),
        title: classNames('sm:!pw-hidden', classes.title ?? ''),
      }}
    >
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
          onClick={handleContinueInside}
        >
          {translate('loginPage>formSubmitButton>signIn')}
        </AuthButton>
        <AuthFooter />
      </div>
    </AuthLayoutBase>
  );
};
