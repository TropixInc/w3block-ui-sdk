import { lazy, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import classNames from 'classnames';

const FormCompleteKYCWithoutLayout = lazy(() =>
  import('../../../auth/components/FormCompleteKYCWithoutLayout').then(
    (module) => ({
      default: module.FormCompleteKYCWithoutLayout,
    })
  )
);

const KYCStatus = lazy(() =>
  import('../KYCStatus').then((module) => ({
    default: module.default,
  }))
);
const Menu = lazy(() =>
  import('../Menu').then((module) => ({
    default: module.Menu,
  }))
);

const ModalBase = lazy(() =>
  import('../ModalBase').then((module) => ({
    default: module.ModalBase,
  }))
);

const MyProfile = lazy(() =>
  import('../MyProfile/MyProfile').then((module) => ({
    default: module.MyProfile,
  }))
);

const PixwayButton = lazy(() =>
  import('../PixwayButton').then((module) => ({
    default: module.PixwayButton,
  }))
);

const Spinner = lazy(() =>
  import('../Spinner').then((module) => ({
    default: module.Spinner,
  }))
);
import { useRequestConfirmationMail } from '../../../auth/hooks/useRequestConfirmationMail';
import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { useProfile } from '../../hooks';
import { useCompanyConfig } from '../../hooks/useCompanyConfig';
import { useGetTenantContext } from '../../hooks/useGetTenantContext/useGetTenantContext';
import { useHasWallet } from '../../hooks/useHasWallet';
import { usePixwaySession } from '../../hooks/usePixwaySession';
import { usePrivateRoute } from '../../hooks/usePrivateRoute';
import TranslatableComponent from '../TranslatableComponent';

const _MyProfileTemplate = () => {
  const { mutate } = useRequestConfirmationMail();
  useHasWallet({});
  const [translate] = useTranslation();
  const { data: profile } = useProfile();
  const { connectProxyPass } = useCompanyConfig();
  const { status } = usePixwaySession();
  const email = profile?.data?.email ?? '';
  const callbackPath = connectProxyPass + PixwayAppRoutes.COMPLETE_SIGNUP;
  const [isOpen, setIsOpen] = useState(false);
  const { data: tenantContext, isLoading: isLoadingTenantContext } =
    useGetTenantContext();

  const contextsActivated = useMemo(() => {
    if (!isLoadingTenantContext && tenantContext) {
      const contexts = tenantContext?.data?.items?.filter(
        ({ active }) => active
      );
      return contexts;
    }
  }, [isLoadingTenantContext, tenantContext]);

  const formattedEmail = useMemo(() => {
    const emailSplitted = email.split('@');
    if (emailSplitted.length === 1) return emailSplitted;
    return emailSplitted[0]
      .substring(0, 3)
      .concat('****@')
      .concat(emailSplitted[1]);
  }, [email]);

  const handleConfirm = () => {
    setIsOpen(true);
    mutate({ email, callbackPath });
  };

  const UnsignedUserAlert = () => {
    return (
      <>
        <ModalBase isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <p className="pw-font-montserrat pw-text-lg pw-font-bold pw-mb-[24px] pw-text-center">
            {translate('shared>myProfile>verifyEmail')}
          </p>
          <p className="pw-font-montserrat pw-text-sm pw-font-normal pw-text-center">
            {translate('auth>modalActionBlocked>verifyEmail>sendEmail')}
            <p>{formattedEmail}</p>
          </p>
        </ModalBase>
        <div className="pw-p-[16px_16px_24px] pw-h-[75px] pw-bg-[#FBEEF2] pw-rounded-[8px] pw-flex pw-justify-between pw-items-center pw-w-full pw-mt-[25px]">
          <div>
            <div>
              <p className="pw-font-montserrat pw-text-sm pw-font-semibold pw-text-[#ED4971]">
                {translate('auth>emailConfirmation>mailResentStepTitle')}
              </p>
              <p className="pw-font-montserrat pw-text-sm pw-font-normal pw-hidden sm:pw-block ">
                {translate('shared>myProfile>confirmText')}
              </p>
            </div>
          </div>
          <PixwayButton
            onClick={handleConfirm}
            className={classNames(
              '!pw-font-medium !pw-p-[5px_24px] !pw-text-xs !pw-leading-[18px] !pw-rounded-full !pw-shadow-[0_2px_4px_#00000042] pw-border-b pw-border-b-[#FFFFFF] pw-cursor-pointer !pw-bg-[#ED4971]',
              'hover:!pw-shadow-[0_2px_4px_#00000042]'
            )}
          >
            {translate('shared>myProfile>confirm')}
          </PixwayButton>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="pw-flex pw-flex-col pw-w-screen pw-font-poppins pw-container pw-mx-auto">
        <div
          className={classNames(
            'pw-flex pw-flex-col pw-w-full pw-flex-1 pw-py-[59px]'
          )}
        >
          {status === 'unauthenticated' ? <UnsignedUserAlert /> : null}
          <div className="pw-flex pw-w-full pw-gap-x-6 pw-my-[25px]">
            <div className="pw-w-[295px] pw-shrink-0 pw-hidden sm:pw-block">
              <Menu />
            </div>
            <div className="pw-w-full">
              <div className="pw-px-4 sm:pw-px-0 sm:pw-pl-8 pw-w-full">
                <MyProfile />
              </div>
              <div className="pw-px-4 sm:pw-px-0 sm:pw-pl-8 pw-w-full">
                {isLoadingTenantContext ? (
                  <div className="pw-mt-6 pw-w-full pw-flex pw-flex-col pw-gap-[34px] pw-items-center pw-bg-white pw-rounded-[20px] pw-shadow-[2px_2px_10px] pw-shadow-[#00000014] pw-p-[34px]">
                    <Spinner />
                  </div>
                ) : (
                  profile &&
                  contextsActivated?.length &&
                  contextsActivated.map(({ contextId, context, data }) =>
                    (data as any)?.profileScreen?.hidden ? null : (
                      <div
                        key={contextId}
                        className="pw-mt-6 pw-w-full pw-flex pw-flex-col pw-gap-[34px] pw-items-start pw-bg-white pw-rounded-[20px] pw-shadow-[2px_2px_10px] pw-shadow-[#00000014] pw-p-[34px]"
                      >
                        <div className="pw-w-full pw-flex pw-justify-between">
                          <p className="pw-text-2xl pw-font-semibold pw-font-poppins">
                            {translate('auth>myProfileTemplate>moreInfos')} -{' '}
                            {context?.description}
                          </p>
                          {context?.slug === 'signup' && (
                            <KYCStatus status={profile?.data?.kycStatus} />
                          )}
                        </div>

                        <div className="pw-w-full">
                          <FormCompleteKYCWithoutLayout
                            key={contextId}
                            renderSubtitle={false}
                            userId={profile?.data.id}
                            contextId={contextId}
                            contextSlug={context?.slug}
                            userKycStatus={profile?.data?.kycStatus}
                            profilePage
                          />
                        </div>
                      </div>
                    )
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const MyProfileTemplate = () => {
  const { isLoading, isAuthorized } = usePrivateRoute();

  return isLoading || !isAuthorized ? null : (
    <TranslatableComponent>
      <_MyProfileTemplate />
    </TranslatableComponent>
  );
};
