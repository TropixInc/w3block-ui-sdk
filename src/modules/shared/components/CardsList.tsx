import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDeleteSavedCard } from '../../checkout/hooks/useDeleteSavedCard';
import { useGetSavedCards } from '../../checkout/hooks/useGetSavedCards';
import { ErrorBox } from './ErrorBox';
import { ModalBase } from './ModalBase';
import { PixwayButton } from './PixwayButton';
import { Spinner } from './Spinner';
import { getCardBrandIcon } from '../utils/getCardBrandIcon';

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
      <div className="pw-p-8 pw-text-center">
        <p>{translate('shared>cardList>wantDeleteCard')}</p>
        <p className="pw-font-semibold">
          {name ?? brand} ({'Final'} {lastNumbers})?
        </p>
        <ErrorBox customError={errorDeleteCard} />
        <div className="pw-flex sm:pw-flex-row pw-flex-col pw-justify-around pw-mt-8">
          <PixwayButton
            onClick={onClose}
            disabled={isLoadingDelete}
            className="pw-mt-4 !pw-py-3 !pw-px-[42px] !pw-bg-white !pw-text-xs !pw-text-black pw-border pw-border-slate-800 !pw-rounded-full hover:pw-bg-slate-500 hover:pw-shadow-xl"
          >
            {translate('components>cancelMessage>cancel')}
          </PixwayButton>
          <PixwayButton
            onClick={onDelete}
            disabled={isLoadingDelete}
            className="pw-mt-4 !pw-py-3 !pw-px-[42px] !pw-bg-[#295BA6] !pw-text-xs !pw-text-[#FFFFFF] pw-border pw-border-[#295BA6] !pw-rounded-full hover:pw-bg-[#295BA6] hover:pw-shadow-xl"
          >
            {translate('shared>cardList>deleteCard')}
          </PixwayButton>
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
    <div className="pw-rounded-lg pw-border pw-border-slate-300 pw-p-5 pw-w-full pw-flex pw-flex-col pw-gap-1 pw-items-start">
      {getCardBrandIcon(brand.toLocaleLowerCase())}
      <p className="pw-font-bold">{name}</p>
      <p>
        {'**** **** ****'} {lastNumbers}
      </p>
      <p>{'CVV ***'}</p>
      <button
        onClick={() => {
          setIsOpen(true);
        }}
        className="pw-mt-2 pw-text-[#0904FA] pw-font-semibold"
      >
        {translate('shared>delete')}
      </button>
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
    isLoading,
    error: errorGetCards,
  } = useGetSavedCards();

  const [translate] = useTranslation();
  const {
    mutate: deleteCard,
    isSuccess,
    isLoading: isLoadingDelete,
    error: errorDeleteCard,
  } = useDeleteSavedCard();

  useEffect(() => {
    if (isSuccess) refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  if (isLoading || isLoadingDelete)
    return (
      <div className="pw-flex pw-flex-col pw-justify-center pw-items-center pw-mt-10">
        <Spinner className="pw-h-13 pw-w-13" />
      </div>
    );
  if (errorGetCards) return <ErrorBox customError={errorGetCards} />;
  if (cardsList?.data?.items && cardsList?.data?.items?.length)
    return (
      <div className="pw-w-full pw-flex pw-flex-col pw-gap-[34px] pw-items-start pw-bg-white pw-p-[34px]">
        {cardsList.data.items.map((res) => {
          return (
            <CardComponent
              key={res.id}
              name={res.name}
              brand={res.brand}
              lastNumbers={res.lastNumbers}
              deleteCard={() => deleteCard(res.id)}
              errorDeleteCard={errorDeleteCard}
              isLoadingDelete={isLoadingDelete}
            />
          );
        })}
      </div>
    );
  else
    return (
      <div className="pw-w-full pw-flex pw-flex-col pw-gap-[34px] pw-items-start pw-bg-white pw-p-[34px]">
        {translate('shared>cardList>creditCardNotFound')}
      </div>
    );
};
