import { useEffect, useMemo, useState } from 'react';

import ArrowPagination from '../../assets/ArrowPagination.svg?react';

export enum PaginationAlignment {
  LEFT = 'justify-start',
  CENTER = 'justify-center',
  RIGHT = 'justify-end',
}

interface DataGridPaginationProps {
  totalPages: number;
  changePage: (next: number) => void;
  page: number;
  alignment?: PaginationAlignment;
  className?: string;
}

export const DataGridPagination = ({
  page,
  totalPages = 2,
  changePage,
  alignment = PaginationAlignment.CENTER,
  className,
}: DataGridPaginationProps) => {
  const [currentPage, setCurrentPage] = useState(page);

  const numbersToShow = useMemo(() => {
    if (currentPage > 2 && currentPage < totalPages - 1) {
      return [currentPage - 1, currentPage, currentPage + 1];
    } else if (currentPage == 1 || currentPage == 2) {
      return totalPages > 2 ? [1, 2, 3] : [1, 2];
    } else if (totalPages > 3) {
      return [totalPages - 3, totalPages - 2, totalPages - 1];
    }
    return [totalPages - 2, totalPages - 1, totalPages];
  }, [currentPage, totalPages]);

  useEffect(() => {
    changePage(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const changePageState = (number: number) => {
    if (number > totalPages) setCurrentPage(totalPages);
    else if (number < 1) setCurrentPage(1);
    else setCurrentPage(number);
  };

  const renderPageButton = (pageNumber: number) => {
    return (
      <div
        onClick={() => changePageState(pageNumber)}
        key={pageNumber}
        className={`pw-mx-1 pw-text-brand-primary pw-flex pw-h-10 pw-w-10 pw-cursor-pointer pw-items-center pw-justify-center pw-font-semibold pw-text-[15px] pw-rounded-md ${
          currentPage == pageNumber
            ? 'pw-border-2 pw-border-brand-primary'
            : 'pw-border-0'
        }`}
      >
        <p className="">{pageNumber}</p>
      </div>
    );
  };

  return (
    <div className={`flex ${alignment} ${className}`}>
      <div
        onClick={() => changePageState(currentPage - 1)}
        className="pw-mr-1 pw-flex pw-h-10 pw-w-10 pw-cursor-pointer pw-items-center pw-justify-center pw-rounded-md"
      >
        <ArrowPagination className="pw-stroke-brand-primary" />
      </div>
      {currentPage > 2 && totalPages > 4 ? renderPageButton(1) : null}

      {currentPage > 2 && totalPages > 4 ? (
        <div className="pw-mx-1 pw-flex pw-h-10 pw-w-10 pw-items-center pw-justify-center pw-font-bold pw-text-brand-primary">
          ...
        </div>
      ) : null}
      {numbersToShow.map(renderPageButton)}
      {currentPage < totalPages - 2 && totalPages > 4 ? (
        <div className="pw-mx-1 pw-flex pw-h-10 pw-w-10 pw-items-center pw-justify-center pw-font-bold pw-text-brand-primary">
          ...
        </div>
      ) : null}

      {totalPages > 3 ? renderPageButton(totalPages) : null}
      <div
        onClick={() => changePageState(currentPage + 1)}
        className="pw-ml-1 pw-flex pw-h-10 pw-w-10 pw-cursor-pointer pw-items-center pw-justify-center pw-rounded-md"
      >
        <ArrowPagination className="pw-stroke-brand-primary pw-rotate-180" />
      </div>
    </div>
  );
};
