import { useMemo, useState } from 'react';

import { Erc20TokenHistory } from '../../../dashboard/interface/ercTokenHistoryInterface';
import { InternalPagesLayoutBase, useRouterConnect } from '../../../shared';
import { ReactComponent as UserIcon } from '../../../shared/assets/icons/userOutlined.svg';
import { Pagination } from '../../../shared/components/Pagination';
import {
  TableDefault,
  TableHeaderItem,
} from '../../../shared/components/TableDefault/TableDefault';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useGuardPagesWithOptions } from '../../../shared/hooks/useGuardPagesWithOptions/useGuardPagesWithOptions';
import { ActionBusinessCardSDK } from '../../components/actionBusinessCardSDK';
import { useGetAllReportsAdmin } from '../../hooks/useGetAllReportsAdmin';
import { useGetAllReportsByOperatorId } from '../../hooks/useGetAllReportsByOperatorId';
import { useLoyaltiesInfo } from '../../hooks/useLoyaltiesInfo';

export const UserReportTemplate = () => {
  const { pushConnect } = useRouterConnect();
  const [actualPage, setActualPage] = useState(1);
  useGuardPagesWithOptions({ needBusiness: true });
  const { loyalties } = useLoyaltiesInfo();
  const { data: adminHistory } = useGetAllReportsAdmin({ page: actualPage });
  const { data: loyaltyHistory } = useGetAllReportsByOperatorId({
    page: actualPage,
  });
  const mainLoyaltie = useMemo(() => {
    if (loyalties.length > 0) {
      return loyalties[0];
    }
  }, [loyalties]);

  const getTransferColorAndStatus = (to: string, from?: string): any => {
    if (mainLoyaltie) {
      if (to == mainLoyaltie.tokenIssuanceAddress) {
        return {
          color: 'green',
          status: 'Crédito',
        };
      } else if (from == mainLoyaltie.tokenTransferabilityAddress) {
        return {
          color: 'red',
          status: 'Debito',
        };
      } else {
        return {
          color: 'green',
          status: 'Crédito',
        };
      }
    }
  };

  const header: TableHeaderItem[] = [
    {
      key: '',
      name: 'Status',
      component: (item: Erc20TokenHistory) => (
        <div className="pw-flex pw-items-center pw-gap-2 pw-py-4">
          <div
            style={{
              backgroundColor: getTransferColorAndStatus(
                item.request.to,
                item.request.from
              ).color,
            }}
            className="pw-w-2 pw-h-2 pw-rounded-full"
          ></div>
          <p className="pw-text-slate-500 pw-text-sm pw-font-semibold">
            {
              getTransferColorAndStatus(item.request.to, item.request.from)
                .status
            }
          </p>
        </div>
      ),
    },

    {
      key: '',
      name: 'Endereço da carteira',
      component: (item: Erc20TokenHistory) => (
        <p className="pw-text-slate-500 pw-text-sm pw-font-semibold">
          {item.request.to == mainLoyaltie?.tokenIssuanceAddress
            ? item.request.from
            : item.request.to}
        </p>
      ),
    },
    {
      key: 'quantity',
      name: 'Qtde.',
      component: (item: Erc20TokenHistory) => (
        <p className="pw-text-slate-500 pw-text-sm pw-font-semibold">
          {item.request.amount}
        </p>
      ),
    },
    {
      key: 'executeAt',
      name: 'Data',
      component: (item: Erc20TokenHistory) => (
        <p className="pw-text-slate-500 pw-text-sm pw-font-semibold">
          {new Date(item.executeAt ?? Date.now()).toLocaleDateString()}
        </p>
      ),
    },
  ];

  const tableContent = useMemo(() => {
    if (adminHistory && adminHistory?.items?.length > 0) {
      return adminHistory;
    } else if (loyaltyHistory && loyaltyHistory?.items?.length > 0) {
      return loyaltyHistory;
    } else return { items: [], meta: { totalPages: 1 } };
  }, [loyaltyHistory, adminHistory]);

  return (
    <InternalPagesLayoutBase>
      <div className=" pw-p-6 pw-bg-white pw-rounded-[20px] pw-shadow pw-flex-col pw-justify-start pw-items-start">
        <div className=" pw-text-black pw-text-[23px] pw-font-semibold pw-leading-loose">
          Fidelidade
        </div>
        <ActionBusinessCardSDK
          title="Pagamento"
          icon={<UserIcon />}
          description="Registrar compras para promover descontos e conceder cashbacks "
          buttonText="Registrar pagamento"
          onClick={() => pushConnect(PixwayAppRoutes.LOYALTY_PAYMENT)}
        />
        <div className="pw-flex pw-justify-between pw-items-center pw-mt-8">
          <p className="pw-text-zinc-800 pw-text-lg pw-font-medium pw-leading-[23px]">
            Relatório de uso
          </p>
        </div>
        <TableDefault
          className="pw-mt-[20px]"
          data={tableContent?.items ?? []}
          header={header}
        />
        {tableContent.meta.totalPages > 1 && (
          <div className="pw-flex pw-justify-end pw-mt-2">
            <Pagination
              pagesQuantity={tableContent.meta.totalPages}
              currentPage={actualPage}
              onChangePage={function (nextPage: number): void {
                setActualPage(nextPage);
              }}
            />
          </div>
        )}
      </div>
    </InternalPagesLayoutBase>
  );
};
