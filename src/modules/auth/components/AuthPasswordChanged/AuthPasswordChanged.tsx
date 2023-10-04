import CheckCircleOutlined from '../../../shared/assets/icons/checkCircledOutlined.svg?react';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import useTranslation from '../../../shared/hooks/useTranslation';
import { AuthButton } from '../AuthButton';
import { AuthFooter } from '../AuthFooter';
import { AuthLayoutBase } from '../AuthLayoutBase';

export const AuthPasswordChanged = () => {
  const router = useRouterConnect();
  const { logoUrl } = useCompanyConfig();
  const [translate] = useTranslation();
  return (
    <AuthLayoutBase
      title=""
      logo={logoUrl}
      classes={{
        root: '!pw-px-[26px] sm:!pw-px-5 !pw-pt-[63px] lg:!pw-pt-[28px]',
        contentContainer:
          '!pw-pt-0 sm:!pw-pt-[35px] sm:!pw-px-[35px] !pw-shadow-none sm:!pw-shadow-[1px_1px_10px_rgba(0,0,0,0.2)] !pw-bg-transparent sm:!pw-bg-white !pw-px-0 sm:!pw-px-[69px] !pw-max-w-none sm:!pw-max-w-[514px]',
        logo: 'w-[130px] h-[130px]',
      }}
    >
      <div className="pw-pt-0 pw-pb-6 sm:pw-my-6">
        <CheckCircleOutlined className="pw-stroke-[#76DE8D] pw-w-9 pw-h-9 pw-mx-auto mb-6" />
        <h1 className="pw-font-bold pw-text-2xl pw-leading-[29px] pw-text-[#35394C] pw-text-center pw-mb-6 pw-px-11 sm:pw-px-0">
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
