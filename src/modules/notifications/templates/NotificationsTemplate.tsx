import { InternalPagesLayoutBase } from '../../shared/components/InternalPagesLayoutBase';
import TranslatableComponent from '../../shared/components/TranslatableComponent';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { SectionCard } from '../../shared/components/ui/SectionCard';
import { usePrivateRoute } from '../../shared/hooks/usePrivateRoute';
import useTranslation from '../../shared/hooks/useTranslation';
import { NotificationsWrapper } from '../components/NotificationsWrapper';

const _NotificationsTemplate = () => {
  const [translate] = useTranslation();

  return (
    <div className="pw-flex pw-flex-col pw-gap-4 pw-px-4 sm:pw-px-0">
      <PageHeader
        title={translate('notifications>notificationsTemplate>title')}
        subtitle={translate('notifications>notificationsTemplate>explain')}
      />
      <SectionCard className="sm:pw-max-w-[560px]">
        <NotificationsWrapper />
      </SectionCard>
    </div>
  );
};

export const NotificationsTemplate = () => {
  const { isLoading, isAuthorized } = usePrivateRoute();

  return isLoading || !isAuthorized ? null : (
    <TranslatableComponent>
      <InternalPagesLayoutBase
        classes={{ middleSectionContainer: 'pw-mb-[85px]' }}
      >
        <_NotificationsTemplate />
      </InternalPagesLayoutBase>
    </TranslatableComponent>
  );
};
