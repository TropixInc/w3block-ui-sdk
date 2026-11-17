/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

import classNames from 'classnames';

import { useDeleteSavedCard } from '../../checkout/hooks/useDeleteSavedCard';
import { useGetSavedCards } from '../../checkout/hooks/useGetSavedCards';
import useTranslation from '../hooks/useTranslation';
import { getCardBrandIcon } from '../utils/getCardBrandIcon';
import { BaseButton } from './Buttons';
import { ErrorBox } from './ErrorBox';
import { ModalBase } from './ModalBase';
import Skeleton from './Skeleton';
import { EmptyState } from './ui/EmptyState';
import { UI } from './ui/tokens';

const DeleteModal = ({
  isOpen,
  lastNumbers,
  name,
  brand,
  onClose,
  onDelete,
  errorDeleteCard,
  isLoadingDelete,
}: {
  isOpen: boolean;
  name: string;
  brand: string;
  lastNumbers: string;
  onClose(): void;
  onDelete(): void;
  errorDeleteCard: any;
  isLoadingDelete: boolean;
}) => {
  const [translate] = useTranslation();
  return (
    <ModalBase isOpen={isOpen} onClose={onClose}>
      <div className="pw-p-2 pw-text-center">
        <p
          className={classNames(
            'pw-text-[15px] pw-font-semibold pw-m-0',
            UI.text
          )}
        >
          {translate('shared>cardList>wantDeleteCard')}
        </p>
        <p
          className={classNames('pw-text-[13px] pw-mt-1 pw-m-0', UI.textMuted)}
        >
          {name ?? brand} · {translate('shared>cardList>ending')} {lastNumbers}
        </p>
        <ErrorBox customError={errorDeleteCard} />
        <div className="pw-flex pw-flex-col-reverse sm:pw-flex-row pw-justify-center pw-gap-2 pw-mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoadingDelete}
            className={UI.buttonSecondary}
          >
            {translate('components>cancelMessage>cancel')}
          </button>
          <BaseButton onClick={onDelete} disabled={isLoadingDelete}>
            {translate('shared>cardList>deleteCard')}
          </BaseButton>
        </div>
      </div>
    </ModalBase>
  );
};

const CardComponent = ({
  lastNumbers,
  name,
  brand,
  deleteCard,
  errorDeleteCard,
  isLoadingDelete,
}: {
  name: string;
  brand: string;
  lastNumbers: string;
  deleteCard(): void;
  errorDeleteCard: any;
  isLoadingDelete: boolean;
}) => {
  const [translate] = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className={classNames(
        UI.card,
        'pw-p-4 pw-flex pw-flex-col pw-gap-3 pw-min-w-0 pw-border pw-border-[#EEF0F3]'
      )}
    >
      <div className="pw-flex pw-items-center pw-justify-between pw-gap-2">
        <span className="pw-flex pw-items-center pw-gap-2 pw-min-w-0">
          <span className="pw-shrink-0 [&_svg]:pw-w-8 [&_svg]:pw-h-8">
            {getCardBrandIcon(brand.toLocaleLowerCase())}
          </span>
          <span
            className={classNames(
              'pw-text-[13px] pw-font-semibold pw-capitalize pw-truncate',
              UI.text
            )}
          >
            {brand}
          </span>
        </span>
      </div>
      <p
        className={classNames(
          'pw-text-[16px] pw-font-semibold pw-tabular-nums pw-tracking-wider pw-m-0',
          UI.text
        )}
      >
        •••• •••• •••• {lastNumbers}
      </p>
      <div className="pw-flex pw-items-center pw-justify-between pw-gap-2">
        <span
          className={classNames('pw-text-[12.5px] pw-truncate', UI.textMuted)}
        >
          {name}
        </span>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="pw-text-[12.5px] pw-font-semibold pw-text-[#C92A2D] hover:pw-underline pw-shrink-0"
        >
          {translate('shared>delete')}
        </button>
      </div>
      <DeleteModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onDelete={() => {
          setIsOpen(false);
          deleteCard();
        }}
        lastNumbers={lastNumbers}
        name={name}
        brand={brand}
        errorDeleteCard={errorDeleteCard}
        isLoadingDelete={isLoadingDelete}
      />
    </div>
  );
};

export const CardsList = () => {
  const {
    data: cardsList,
    refetch,
    isFetching,
    error: errorGetCards,
  } = useGetSavedCards();

  const [translate] = useTranslation();
  const {
    mutate: deleteCard,
    isSuccess,
    isPending: isLoadingDelete,
    error: errorDeleteCard,
  } = useDeleteSavedCard();

  useEffect(() => {
    if (isSuccess) refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  if ((isFetching && !cardsList) || isLoadingDelete)
    return (
      <div className="pw-grid pw-grid-cols-1 sm:pw-grid-cols-2 lg:pw-grid-cols-3 pw-gap-3">
        {[0, 1].map((i) => (
          <div
            key={i}
            className={classNames(UI.card, 'pw-p-4 pw-grid pw-gap-3')}
          >
            <Skeleton className="pw-h-8 pw-w-16 pw-rounded" />
            <Skeleton className="pw-h-4 pw-w-2/3 pw-rounded" />
            <Skeleton className="pw-h-3 pw-w-1/2 pw-rounded" />
          </div>
        ))}
      </div>
    );
  if (errorGetCards) return <ErrorBox customError={errorGetCards} />;
  const items = cardsList?.data?.items ?? [];
  if (items.length)
    return (
      <div className="pw-grid pw-grid-cols-1 sm:pw-grid-cols-2 lg:pw-grid-cols-3 pw-gap-3">
        {items.map((res) => (
          <CardComponent
            key={res.id}
            name={res.name}
            brand={res.brand}
            lastNumbers={res.lastNumbers}
            deleteCard={() => deleteCard(res.id)}
            errorDeleteCard={errorDeleteCard}
            isLoadingDelete={isLoadingDelete}
          />
        ))}
      </div>
    );
  return (
    <EmptyState
      title={translate('shared>cardList>creditCardNotFound')}
      description={translate('shared>cardList>emptyDescription')}
    />
  );
};
