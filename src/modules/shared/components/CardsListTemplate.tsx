import { usePrivateRoute } from '../hooks/usePrivateRoute';
import useTranslation from '../hooks/useTranslation';
import { CardsList } from './CardsList';
import { InternalPagesLayoutBase } from './InternalPagesLayoutBase';
import TranslatableComponent from './TranslatableComponent';
import { PageHeader } from './ui/PageHeader';

const _CardsListTemplate = () => {
  const { isAuthorized, isLoading } = usePrivateRoute();
  const [translate] = useTranslation();
  return isAuthorized && !isLoading ? (
    <InternalPagesLayoutBase>
      <div className="pw-flex pw-flex-col pw-gap-4 pw-px-4 sm:pw-px-0">
        <PageHeader
          title={translate('shared>cardList>title')}
          subtitle={translate('shared>cardList>subtitle')}
        />
        <CardsList />
      </div>
    </InternalPagesLayoutBase>
  ) : null;
};

export const CardsListTemplate = () => {
  return (
    <TranslatableComponent>
      <_CardsListTemplate />
    </TranslatableComponent>
  );
};
