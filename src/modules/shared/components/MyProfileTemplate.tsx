/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';

import classNames from 'classnames';
import { FormCompleteKYCWithoutLayout } from '../../auth/components/FormCompleteKYCWithoutLayout';
import { useRequestConfirmationMail } from '../../auth/hooks/useRequestConfirmationMail';
import { PixwayAppRoutes } from '../enums/PixwayAppRoutes';
import { useCompanyConfig } from '../hooks/useCompanyConfig';
import { useGetTenantContext } from '../hooks/useGetTenantContext';
import { useHasWallet } from '../hooks/useHasWallet';
import { usePixwaySession } from '../hooks/usePixwaySession';
import { usePrivateRoute } from '../hooks/usePrivateRoute';
import { useProfile } from '../hooks/useProfile';
import { ErrorBox } from './ErrorBox';
import KYCStatus from './KYCStatus';
import { ModalBase } from './ModalBase';
import { MyProfile } from './MyProfile';
import { PixwayButton } from './PixwayButton';
import Skeleton from './Skeleton';
import { SectionCard } from './ui/SectionCard';
import TranslatableComponent from './TranslatableComponent';
import useTranslation from '../hooks/useTranslation';
import { InternalPagesLayoutBase } from './InternalPagesLayoutBase';

const _MyProfileTemplate = () => {
  const {
    mutate,
    error: erroMutate,
    isPending: isLoadingMutate,
  } = useRequestConfirmationMail();
  useHasWallet({});
  const [translate] = useTranslation();
  const { data: profile, error: errorProfile } = useProfile();
  const { connectProxyPass } = useCompanyConfig();
  const { status } = usePixwaySession();
  const email = profile?.data?.email ?? '';
  const callbackPath = connectProxyPass + PixwayAppRoutes.COMPLETE_SIGNUP;
  const [isOpen, setIsOpen] = useState(false);
  const {
    data: tenantContext,
    isFetching: isLoadingTenantContext,
    error: errorTenantContext,
  } = useGetTenantContext();

  const contextsActivated = useMemo(() => {
    if (!isLoadingTenantContext && tenantContext) {
      const contexts = tenantContext?.data?.items?.filter(
        (item: any) =>
          item?.active &&
          item?.context?.slug !== 'notification-settings' &&
          item?.context?.slug !== 'admin-notification-settings'
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
        <div className="pw-px-4 pw-py-3 pw-bg-[#FDECEC] pw-rounded-[10px] pw-flex pw-flex-wrap pw-gap-3 pw-justify-between pw-items-center pw-w-full pw-mb-4 pw-mx-4 sm:pw-mx-0 pw-max-w-full">
          <div>
            <div>
              <p className="pw-text-[13px] pw-font-semibold pw-text-[#C92A2D] pw-m-0">
                {translate('auth>emailConfirmation>mailResentStepTitle')}
              </p>
              <p className="pw-text-[12.5px] pw-text-[#4A5567] pw-m-0">
                {translate('shared>myProfile>confirmText')}
              </p>
            </div>
          </div>
          <ErrorBox customError={erroMutate} />
          <PixwayButton
            disabled={isLoadingMutate}
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
    <InternalPagesLayoutBase>
      {status === 'unauthenticated' ? <UnsignedUserAlert /> : null}
      {errorProfile ? (
        <ErrorBox customError={errorProfile} />
      ) : (
        <div className="pw-w-full">
          <div className="pw-px-4 sm:pw-px-0 pw-w-full">
            <MyProfile />
          </div>
          {errorTenantContext ? (
            <ErrorBox customError={errorTenantContext} />
          ) : (
            <div className="pw-px-4 sm:pw-px-0 pw-w-full">
              {isLoadingTenantContext ? (
                <SectionCard className="pw-mt-4">
                  <div className="pw-grid pw-gap-3">
                    <Skeleton className="pw-h-4 pw-w-1/3 pw-rounded" />
                    <Skeleton className="pw-h-9 pw-w-full pw-rounded" />
                    <Skeleton className="pw-h-9 pw-w-full pw-rounded" />
                  </div>
                </SectionCard>
              ) : (
                profile &&
                contextsActivated?.length &&
                contextsActivated?.map(({ contextId, context, data }: any) =>
                  (data as any)?.profileScreen?.hidden ? null : (
                    <SectionCard
                      key={contextId}
                      className="pw-mt-4"
                      title={`${translate(
                        'auth>myProfileTemplate>moreInfos'
                      )} · ${context?.description ?? ''}`}
                      actions={
                        context?.slug === 'signup' ? (
                          <KYCStatus status={profile?.data?.kycStatus} />
                        ) : undefined
                      }
                    >
                      <FormCompleteKYCWithoutLayout
                        key={contextId}
                        renderSubtitle={false}
                        userId={profile?.data?.id}
                        contextId={contextId}
                        contextSlug={context?.slug}
                        userKycStatus={profile?.data?.kycStatus}
                        profilePage
                      />
                    </SectionCard>
                  )
                )
              )}
            </div>
          )}
        </div>
      )}
    </InternalPagesLayoutBase>
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
