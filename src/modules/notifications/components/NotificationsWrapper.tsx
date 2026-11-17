'use client';

import { useMemo } from 'react';

import { FormCompleteKYCWithoutLayout } from '../../auth/components/FormCompleteKYCWithoutLayout';
import Skeleton from '../../shared/components/Skeleton';
import { EmptyState } from '../../shared/components/ui/EmptyState';
import { useGetTenantContext } from '../../shared/hooks/useGetTenantContext';
import { useProfile } from '../../shared/hooks/useProfile';
import useTranslation from '../../shared/hooks/useTranslation';

/**
 * Notification preferences: the tenant's `notification-settings` context
 * rendered as a form. Without that context the page explains that there is
 * nothing to configure instead of staying blank.
 */
export const NotificationsWrapper = () => {
  const [translate] = useTranslation();
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const { data: contexts, isLoading: isLoadingContext } = useGetTenantContext();

  const hasNotificationContext = useMemo(
    () =>
      contexts?.data?.items?.some(
        (item: { context: { slug: string } }) =>
          item?.context?.slug === 'notification-settings'
      ),
    [contexts]
  );

  if (isLoadingProfile || isLoadingContext) {
    return (
      <div className="pw-grid pw-gap-3">
        <Skeleton className="pw-h-5 pw-w-2/3 pw-rounded" />
        <Skeleton className="pw-h-5 pw-w-1/2 pw-rounded" />
        <Skeleton className="pw-h-5 pw-w-3/5 pw-rounded" />
      </div>
    );
  }

  if (!hasNotificationContext) {
    return (
      <EmptyState
        bare
        title={translate('notifications>notificationsTemplate>kycNotFound')}
        description={translate(
          'notifications>notificationsTemplate>emptyDescription'
        )}
        className="pw-py-6"
      />
    );
  }

  return (
    <FormCompleteKYCWithoutLayout
      userId={profile?.data?.id}
      contextSlug="notification-settings"
      keyPage
      renderSubtitle={false}
    />
  );
};
