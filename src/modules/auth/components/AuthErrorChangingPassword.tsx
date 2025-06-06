
import { useTranslation } from 'react-i18next';
import ErrorFilled from '../assets/icons/errorFilled.svg';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { AuthButton } from './AuthButton';


interface Props {
  onRetry: () => void;
}

export const AuthErrorChagingPassword = ({ onRetry }: Props) => {
  const router = useRouterConnect();
  const [translate] = useTranslation();
  return (
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
  );
};
