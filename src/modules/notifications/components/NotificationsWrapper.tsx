"use client";

import useTranslation from "../../shared/hooks/useTranslation";
import { FormCompleteKYCWithoutLayout } from "../../auth/components/FormCompleteKYCWithoutLayout"
import { useProfile } from "../../shared/hooks/useProfile";
import { Spinner } from "../../shared/components/Spinner";
import { useGetTenantContext } from "../../shared/hooks/useGetTenantContext";
import { useMemo } from "react";
import { Alert } from "../../shared/components/Alert";

export const NotificationsWrapper = () => {
  const [translate] = useTranslation()
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const { data: contexts, isLoading: isLoadingContext } = useGetTenantContext();

  const isHaveContextNotification = useMemo(() => {
    if (contexts?.data?.items) {
      return contexts?.data?.items?.some((item: { context: { slug: string; }; }) => item?.context?.slug === "notification-settings")
    }
  }, [contexts])

  return (
    <div className="">
      <p className="pw-m-0 pw-mt-1">{translate('notifications>notificationsTemplate>explain')}</p>
      <p className="pw-m-0 pw-mt-1 pw-mb-8 pw-font-semibold pw-text-sm">{translate('notifications>notificationsTemplate>disclaimer')}</p>
      {isLoadingProfile || isLoadingContext ? <Spinner /> : isHaveContextNotification ?
        <FormCompleteKYCWithoutLayout
          userId={profile?.data?.id}
          contextSlug="notification-settings"
          keyPage
          renderSubtitle={false}
        /> : <Alert>{translate("notifications>notificationsTemplate>kycNotFound")}</Alert>
      }
    </div>
  )
}