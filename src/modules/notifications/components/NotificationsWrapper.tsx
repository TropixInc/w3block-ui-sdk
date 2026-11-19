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

  // The context form is generic (checkbox inputs + submit). Restyle it here
  // as a list of switches with a right-aligned save button, without
  // threading props through the form stack.
  return (
    <div
      className={[
        '[&_form>div]:pw-divide-y [&_form>div]:pw-divide-[#E6E8EC] [&_form>div]:!pw-gap-0',
        '[&_form>div>div]:pw-py-3 [&_form>div>div>div]:!pw-mb-0 [&_form>div>div>div]:pw-flex-row-reverse [&_form>div>div>div]:pw-justify-between',
        '[&_label]:!pw-text-[13.5px] [&_label]:!pw-font-medium [&_label]:!pw-text-[#0F1729] [&_label]:!pw-mb-0',
        '[&_input[type=checkbox]]:pw-appearance-none [&_input[type=checkbox]]:pw-relative [&_input[type=checkbox]]:pw-w-10 [&_input[type=checkbox]]:pw-h-6 [&_input[type=checkbox]]:pw-rounded-full [&_input[type=checkbox]]:pw-bg-[#D5D9E0] [&_input[type=checkbox]]:pw-shrink-0 [&_input[type=checkbox]]:pw-cursor-pointer [&_input[type=checkbox]]:pw-transition-colors',
        "[&_input[type=checkbox]::after]:pw-content-[''] [&_input[type=checkbox]::after]:pw-absolute [&_input[type=checkbox]::after]:pw-top-[3px] [&_input[type=checkbox]::after]:pw-left-[3px] [&_input[type=checkbox]::after]:pw-w-[18px] [&_input[type=checkbox]::after]:pw-h-[18px] [&_input[type=checkbox]::after]:pw-rounded-full [&_input[type=checkbox]::after]:pw-bg-white [&_input[type=checkbox]::after]:pw-shadow-[0_1px_2px_rgba(0,0,0,0.25)] [&_input[type=checkbox]::after]:pw-transition-transform",
        '[&_input[type=checkbox]:checked]:pw-bg-brand-primary [&_input[type=checkbox]:checked::after]:pw-translate-x-4',
        '[&_form>button]:!pw-w-auto [&_form>button]:pw-ml-auto [&_form>button]:pw-block [&_form>button]:!pw-mt-4',
      ].join(' ')}
    >
      <FormCompleteKYCWithoutLayout
        userId={profile?.data?.id}
        contextSlug="notification-settings"
        keyPage
        renderSubtitle={false}
      />
    </div>
  );
};
