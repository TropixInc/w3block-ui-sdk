import { ReactNode, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import { number, object } from 'yup';

import ChevronLeft from '../../assets/icons/chevronLeftFilled.svg?react';

interface Props {
  pagesQuantity: number;
  currentPage: number;
  onChangePage: (nextPage: number) => void;
}

interface Form {
  page: number;
}

export const PaginationNumbers = ({
  pagesQuantity,
  currentPage,
  onChangePage,
}: Props) => {
  const [currentPagesQuantity, setCurrentPagesQuantity] =
    useState(pagesQuantity);

  const schemaRef = useRef(
    object().shape({
      page: number().min(1),
    })
  );

  const methods = useForm<Form>({
    defaultValues: {
      page: currentPage ? currentPage : 1,
    },
    mode: 'onChange',
    resolver: yupResolver(schemaRef.current),
  });

  useEffect(() => {
    if (pagesQuantity && pagesQuantity !== currentPagesQuantity) {
      setCurrentPagesQuantity(pagesQuantity);
    }
  }, [pagesQuantity, currentPagesQuantity]);

  useEffect(() => {
    methods.setValue('page', currentPage, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }, [currentPage, methods]);

  const onPreviousPage = () => {
    const previousPage = currentPage - 1;
    methods.setValue('page', previousPage);
    if (previousPage > 0 && previousPage <= currentPagesQuantity) {
      onChangePage(previousPage);
    }
  };

  return (
    <div className="pw-flex pw-items-center pw-gap-x-4">
      <PaginationButton onClick={onPreviousPage}>
        <ChevronLeft className="pw-fill-[#295BA6] pw-w-[10.5px] pw-h-[19.5px]" />
      </PaginationButton>

      {currentPage > 2 ? (
        <>
          <PaginationButton onClick={() => onChangePage(1)}>1</PaginationButton>
          {currentPage > 3 ? <PaginationButton>...</PaginationButton> : null}
        </>
      ) : null}

      {currentPage > 1 ? (
        <PaginationButton onClick={() => onChangePage(currentPage - 1)}>
          {currentPage - 1}
        </PaginationButton>
      ) : null}

      <PaginationButton
        selected={true}
        onClick={() => onChangePage(currentPage)}
      >
        {currentPage}
      </PaginationButton>

      {currentPage < pagesQuantity ? (
        <PaginationButton onClick={() => onChangePage(currentPage + 1)}>
          {currentPage + 1}
        </PaginationButton>
      ) : null}

      {currentPage === 1 ? (
        <PaginationButton onClick={() => onChangePage(currentPage + 2)}>
          {currentPage + 2}
        </PaginationButton>
      ) : null}

      {currentPage < pagesQuantity - 1 ? (
        <>
          {currentPage < pagesQuantity - 2 ? (
            <PaginationButton>...</PaginationButton>
          ) : null}
          <PaginationButton onClick={() => onChangePage(pagesQuantity)}>
            {pagesQuantity}
          </PaginationButton>
        </>
      ) : null}
    </div>
  );
};

const PaginationButton = ({
  onClick,
  children,
  selected = false,
}: {
  onClick?: () => void;
  selected?: boolean;
  children: ReactNode;
}) => (
  <button
    className={classNames(
      'pw-w-10 pw-h-10 pw-rounded-sm pw-flex pw-justify-center pw-items-center pw-bg-[#EFEFEF] pw-text-[#295BA6] pw-text-[15px] pw-leading-[22px] pw-font-semibold ',
      selected ? 'pw-border-[#295BA6] pw-border' : ''
    )}
    onClick={onClick}
  >
    {children}
  </button>
);
