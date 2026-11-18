import { usePrivateRoute } from '../hooks/usePrivateRoute';
import useTranslation from '../hooks/useTranslation';
import { InternalPagesLayoutBase } from './InternalPagesLayoutBase';
import RequestsList from './RequestsList';
import TranslatableComponent from './TranslatableComponent';
import { PageHeader } from './ui/PageHeader';
import { SectionCard } from './ui/SectionCard';

const _RequestsTemplate = () => {
  const { isAuthorized, isLoading } = usePrivateRoute();
  const [translate] = useTranslation();
  return isAuthorized && !isLoading ? (
    <InternalPagesLayoutBase>
      <div className="pw-flex pw-flex-col pw-gap-4 pw-px-4 sm:pw-px-0">
        <PageHeader
          title={translate('components>menu>requests')}
          subtitle={translate('shared>requests>subtitle')}
        />
        <SectionCard>
          <RequestsList />
        </SectionCard>
      </div>
    </InternalPagesLayoutBase>
  ) : null;
};

export const RequestsTemplate = () => {
  return (
    <TranslatableComponent>
      <_RequestsTemplate />
    </TranslatableComponent>
  );
};
