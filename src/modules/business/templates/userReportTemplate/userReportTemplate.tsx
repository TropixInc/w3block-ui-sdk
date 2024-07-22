import { lazy, useMemo, useState } from 'react';

import { format } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';
import _ from 'lodash';

import {
  Erc20TokenHistory,
  FromToInterface,
} from '../../../dashboard/interface/ercTokenHistoryInterface';
import UserIcon from '../../../shared/assets/icons/userOutlined.svg?react';
import { TableHeaderItem } from '../../../shared/components/TableDefault/TableDefault';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useGuardPagesWithOptions } from '../../../shared/hooks/useGuardPagesWithOptions/useGuardPagesWithOptions';
import { useLocale } from '../../../shared/hooks/useLocale';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import useTranslation from '../../../shared/hooks/useTranslation';
import { useGetAllReportsAdmin } from '../../hooks/useGetAllReportsAdmin';
import { useGetAllReportsByOperatorId } from '../../hooks/useGetAllReportsByOperatorId';
import { useLoyaltiesInfo } from '../../hooks/useLoyaltiesInfo';

const InternalPagesLayoutBase = lazy(() =>
  import(
    '../../../shared/components/InternalPagesLayoutBase/InternalPagesLayoutBase'
  ).then((mod) => ({ default: mod.InternalPagesLayoutBase }))
);
const Pagination = lazy(() =>
  import('../../../shared/components/Pagination').then((mod) => ({
    default: mod.Pagination,
  }))
);

const TableDefault = lazy(() =>
  import('../../../shared/components/TableDefault/TableDefault').then(
    (mod) => ({
      default: mod.TableDefault,
    })
  )
);

const ActionBusinessCardSDK = lazy(() =>
  import('../../components/actionBusinessCardSDK').then((mod) => ({
    default: mod.ActionBusinessCardSDK,
  }))
);

export const UserReportTemplate = () => {
  const { pushConnect } = useRouterConnect();
  const locale = useLocale();
  const [actualPage, setActualPage] = useState(1);
  useGuardPagesWithOptions({ needBusiness: true, needUser: true });
  const { loyalties } = useLoyaltiesInfo();
  const { data: adminHistory } = useGetAllReportsAdmin({ page: actualPage });
  const { data: loyaltyHistory } = useGetAllReportsByOperatorId({
    page: actualPage,
  });
  const [translate] = useTranslation();
  const mainLoyaltie = useMemo(() => {
    if (loyalties.length > 0) {
      return loyalties[0];
    }
  }, [loyalties]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getTransferColorAndStatus = (from?: FromToInterface): any => {
    if (mainLoyaltie) {
      if (from == null) {
        return {
          color: 'red',
          status: 'Carga',
        };
      } else if (from.type == 'user') {
        return {
          color: 'green',
          status: 'Uso',
        };
      } else {
        return {
          color: 'green',
          status: 'Uso',
        };
      }
    }
  };

  const getTextToShow = (erc: Erc20TokenHistory): string => {
    if (
      erc.from == null &&
      erc.request.metadata &&
      Array.isArray(erc.request.metadata)
    ) {
      return `${erc.request.metadata[0].description} - Gerado pelo operador ${erc.request.metadata[0].operatorName}`;
    } else if (erc.request.metadata && erc.from != null) {
      return `${erc.request.metadata.description} - Feito pelo usuário ${erc.from.user_name}`;
    } else {
      return '';
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
              backgroundColor: getTransferColorAndStatus(item.from).color,
            }}
            className="pw-w-2 pw-h-2 pw-rounded-full"
          ></div>
          <p className="pw-text-slate-500 pw-text-sm pw-font-semibold">
            {getTransferColorAndStatus(item.from).status}
          </p>
        </div>
      ),
    },

    {
      key: 'userInfo',
      name: 'Usuário',
      component: (item: Erc20TokenHistory) =>
        item.from == null ? (
          <div>
            {item.to?.user_name && (
              <p className="pw-text-xs pw-text-slate-900 pw-font-medium">
                {item.to?.user_name}
              </p>
            )}
            {item.to?.email && (
              <p className="pw-text-xs pw-text-slate-700">{item.to?.email}</p>
            )}
            {item.to?.phone && (
              <p className="pw-text-xs pw-text-slate-700">{item.to?.phone}</p>
            )}
            {item.to?.cpf && (
              <p className="pw-text-xs pw-text-slate-700">{item.to?.cpf}</p>
            )}
          </div>
        ) : (
          <div>
            {item.from?.user_name && (
              <p className="pw-text-xs pw-text-slate-900 pw-font-medium">
                {item.from?.user_name}
              </p>
            )}
            {item.from?.email && (
              <p className="pw-text-xs pw-text-slate-700">{item.from?.email}</p>
            )}
            {item.from?.phone && (
              <p className="pw-text-xs pw-text-slate-700">{item.from?.phone}</p>
            )}
            {item.from?.cpf && (
              <p className="pw-text-xs pw-text-slate-700">{item.from?.cpf}</p>
            )}
          </div>
        ),
    },
    {
      key: 'operatorName',
      name: 'Operador',
      component: (item: Erc20TokenHistory) => (
        <p className="pw-text-xs pw-text-slate-900 pw-font-medium">
          {_.get(item, 'loyaltiesTransactions[0].metadata.operatorName', '')}
        </p>
      ),
    },

    {
      key: '',
      name: 'Descrição',
      component: (item: Erc20TokenHistory) => (
        <p className="pw-text-slate-500 pw-text-xs pw-font-regular pw-min-w-[120px] pw-max-w-[300px]">
          {getTextToShow(item)}
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
        <p className="pw-text-slate-500 pw-text-sm pw-font-semibold pw-break-words">
          {item?.executeAt
            ? format(new Date(item?.executeAt ?? Date.now()), 'Pp', {
                locale: locale === 'pt-BR' ? ptBR : enUS,
              })
            : null}
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
          {translate('business>userReportTemplate>fidelity')}
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
            {translate('business>userReportTemplate>useReports')}
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
