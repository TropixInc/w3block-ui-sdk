import { useEffect, useMemo, useState } from 'react';

import classNames from 'classnames';
import { format } from 'date-fns';

import { Pagination } from '../../../shared/components/Pagination';
import useTranslation from '../../../shared/hooks/useTranslation';

export const TableBase = ({
  data,
  columns,
}: {
  data: any[];
  columns: string[];
}) => {
  const [translate] = useTranslation();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itensPerPage = 6;

  const tokensDisplaying = useMemo(() => {
    const startIndex = (page - 1) * itensPerPage;
    const lastIndex = page * itensPerPage;
    return data.slice(startIndex, lastIndex);
  }, [page, data]);

  useEffect(() => {
    setTotalPages(Math.ceil(data.length / itensPerPage));
  }, [data]);

  return (
    <div className="pw-w-full pw-flex pw-flex-col pw-gap-[16px]">
      <div className="pw-w-full pw-overflow-x-scroll pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] ">
        <div className="pw-flex pw-justify-between pw-bg-[#295BA6] pw-border pw-rounded-t-[16px]">
          {columns.map((item, index) => (
            <div
              key={item}
              className={classNames(
                index === 0
                  ? 'pw-w-[117px] sm:pw-w-[150px]'
                  : 'pw-w-[128px] sm:pw-w-[128px]',
                'pw-py-[13.5px] pw-pl-[20px] pw-text-left pw-text-[14px] pw-text-[#FFFFFF] pw-font-semibold pw-leading-[21px]'
              )}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="pw-flex pw-flex-col">
          {tokensDisplaying.length ? (
            tokensDisplaying.map((item) => (
              <div
                key={item.id}
                className="pw-flex pw-justify-between pw-border-b pw-border-[#EFEFEF]"
              >
                <div className=" pw-pl-[20px] pw-w-[150px] pw-flex pw-justify-start pw-items-center pw-py-[21.5px] pw-text-[14px] pw-leading-[21px] pw-text-[#777E8F]">
                  {item.name}
                </div>
                <div className="hidden sm:flex pw-w-[128px] pw-flex pw-justify-center pw-items-center pw-py-[21.5px] pw-text-[14px] pw-leading-[21px] pw-text-[#777E8F]">
                  {item.document}
                </div>
                <div className="pw-w-[128px] pw-flex pw-justify-center pw-items-center pw-py-[21.5px] pw-text-[14px] pw-leading-[21px] pw-text-[#777E8F]">
                  {item.tokenId.slice(0, 9)}
                </div>
                <div className="hidden sm:flex pw-w-[128px] pw-flex pw-justify-center pw-items-center pw-py-[21.5px] pw-text-[14px] pw-leading-[21px] pw-text-[#777E8F]">
                  {item.wallet.slice(0, 9)}
                  {'...'}
                </div>
                <div className="hidden sm:flex pw-w-[128px] pw-flex pw-justify-center pw-items-center pw-py-[21.5px] pw-text-[14px] pw-leading-[21px] pw-text-[#777E8F]">
                  {format(new Date(item.date), 'dd.MM.yyyy')}
                </div>
                <div className="pw-w-[128px] pw-flex pw-justify-center pw-items-center pw-py-[21.5px] pw-text-[14px] pw-leading-[21px] pw-text-[#777E8F]">
                  {item.locale}
                </div>
                <div className="pw-w-[128px] pw-flex pw-justify-start pw-items-center pw-py-[21.5px] pw-text-[14px] pw-leading-[21px] pw-text-[#777E8F]">
                  <div
                    className={classNames(
                      'pw-rounded-full pw-w-[6px] pw-h-[6px] pw-mr-2',
                      item.status === 'Erro'
                        ? 'pw-bg-[#ED4971]'
                        : 'pw-bg-[#009A6C]'
                    )}
                  />
                  <span className="hidden sm:flex ">{item.status}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="pw-flex pw-justify-between pw-border-b pw-border-[#EFEFEF]">
              <div className="pw-pl-[50px] pw-py-[21.5px] pw-text-[14px] pw-leading-[21px] pw-text-[#777E8F]">
                {translate('token>pass>notResult')}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="pw-w-full pw-flex pw-justify-end pw-gap-2">
        <Pagination
          onChangePage={setPage}
          pagesQuantity={totalPages}
          currentPage={page}
        />
      </div>
    </div>
  );
};
