import { useMemo, useState, lazy } from 'react';

import fileDownload from 'js-file-download';

import { useGetDeferred } from '../../../business/hooks/useGetDeferred';
import { useGetDeferredByUserId } from '../../../business/hooks/useGetDeferredByUserId';
import { useGetXlsxDeferred } from '../../../business/hooks/useGetXlsxDeferred';
import { useProfile } from '../../../shared';
import { DateFilter } from '../../../shared/components/DateFilter';
import { PixwayButton } from '../../../shared/components/PixwayButton';
import { Selectinput } from '../../../shared/components/SelectInput/SelectInput';
import { Spinner } from '../../../shared/components/Spinner';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useGuardPagesWithOptions } from '../../../shared/hooks/useGuardPagesWithOptions/useGuardPagesWithOptions';
import { useUserWallet } from '../../../shared/hooks/useUserWallet';
import { generateRandomUUID } from '../../../shared/utils/generateRamdomUUID';
import { useGetApi } from '../../hooks/useGetApi';

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

const StatementComponentSDK = lazy(() =>
  import(
    '../../../shared/components/StatementComponentSDK/StatementComponentSDK'
  ).then((mod) => ({
    default: mod.StatementComponentSDK,
  }))
);

export const WalletFutureStatementTemplateSDK = () => {
  const { loyaltyWallet } = useUserWallet();
  const [actualPage, setActualPage] = useState(1);
  const { data: profile } = useProfile();
  const loyaltyWalletDefined = useMemo(() => {
    return loyaltyWallet.length ? loyaltyWallet[0] : undefined;
  }, [loyaltyWallet]);
  const [defaultDate, setDefaultDate] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | string>();
  const [endDate, setEndDate] = useState<Date | string>();
  const [selected, setSelected] = useState<string | undefined>('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<
    string | undefined
  >('');
  const userRoles = profile?.data.roles || [];
  const isAdmin = Boolean(
    userRoles?.includes('admin') || userRoles?.includes('superAdmin')
  );
  const { data, isLoading } = useGetDeferredByUserId(
    profile?.data?.id ?? '',
    {
      page: actualPage,
      sortBy: 'createdAt',
      orderBy: 'DESC',
      loyaltyId: loyaltyWalletDefined?.loyaltyId,
      startDate: startDate ? new Date(startDate).toISOString() : '',
      endDate: endDate ? new Date(endDate).toISOString() : '',
      rangeDateBy: selected ? selected : 'createdAt',
    },
    !!loyaltyWalletDefined && !isAdmin
  );

  const { data: adminDeferred, isLoading: loadingAdminDeferred } =
    useGetDeferred(
      {
        page: actualPage,
        sortBy: 'createdAt',
        orderBy: 'DESC',
        loyaltyId: loyaltyWalletDefined?.loyaltyId,
        startDate: startDate ? new Date(startDate).toISOString() : '',
        endDate: endDate ? new Date(endDate).toISOString() : '',
        rangeDateBy: selected ? selected : 'createdAt',
        walletAddress: selectedRestaurant,
      },
      !!loyaltyWalletDefined && isAdmin
    );

  const { data: restaurants } = useGetApi({
    enabled: isAdmin,
  });

  const xlsx = useGetXlsxDeferred(
    {
      sortBy: 'createdAt',
      orderBy: 'DESC',
      loyaltyId: loyaltyWalletDefined?.loyaltyId,
      startDate: startDate ? new Date(startDate).toISOString() : '',
      endDate: endDate ? new Date(endDate).toISOString() : '',
      walletAddress: isAdmin
        ? selectedRestaurant
        : profile?.data?.mainWallet?.address ?? '',
      rangeDateBy: selected ? selected : 'createdAt',
    },
    !!loyaltyWalletDefined
  );

  const initDowload = () => {
    if (xlsx.data) fileDownload(xlsx.data?.data, 'relatorioExport.xlsx');
  };

  const filterOptions = [
    { label: 'Data de Criação', value: 'createdAt' },
    { label: 'Data de Recebimento', value: 'executeAt' },
  ];

  const restaurantOptions = restaurants?.data?.data?.map(
    (res: { attributes: { name: string; walletAddress: string } }) => {
      return {
        label: res?.attributes?.name,
        value: res?.attributes?.walletAddress,
      };
    }
  );

  const dataToUse = () => {
    if (isAdmin) return adminDeferred;
    else return data;
  };

  useGuardPagesWithOptions({
    needUser: true,
    redirectPage: PixwayAppRoutes.SIGN_IN,
  });

  return (
    <InternalPagesLayoutBase>
      <div className="pw-p-[20px] pw-mx-[16px] pw-max-width-full sm:pw-mx-0 sm:pw-p-[24px] pw-pb-[32px] sm:pw-pb-[24px] pw-bg-white pw-shadow-md pw-rounded-lg">
        <p className="pw-text-[23px] pw-font-[600]">Recebimentos futuros</p>
        <div className="pw-mt-3 pw-flex sm:pw-flex-row pw-flex-col pw-gap-4 pw-mx-[16px] sm:pw-mx-0">
          <Selectinput
            options={filterOptions ?? []}
            selected={selected ?? ''}
            onChange={setSelected}
            placeholder="Data de Criação"
            className="sm:pw-w-[200px] pw-w-full"
            hideFirstOption
          />
          <DateFilter
            onChangeStartDate={setStartDate}
            onChangeEndDate={setEndDate}
            defaultDate={defaultDate}
            onChangeDefaultDate={setDefaultDate}
            onCancel={() => {
              setStartDate('');
              setEndDate('');
            }}
            startDate={startDate as Date}
            endDate={endDate as Date}
            placeholder={'Data'}
          />
          {isAdmin ? (
            <Selectinput
              options={restaurantOptions ?? []}
              selected={selectedRestaurant ?? ''}
              onChange={setSelectedRestaurant}
              placeholder="Restaurantes"
              className="sm:pw-w-[250px] pw-w-full"
            />
          ) : null}
          <PixwayButton
            onClick={() => initDowload()}
            disabled={!xlsx.data}
            className="!pw-py-2 !pw-px-[30px] !pw-bg-white !pw-text-xs !pw-text-black pw-border pw-border-slate-800 !pw-rounded-full hover:pw-bg-slate-500 hover:pw-shadow-xl disabled:pw-opacity-50 disabled:!pw-bg-white"
          >
            Baixar relatório
          </PixwayButton>
        </div>
      </div>
      <div className="pw-mt-[20px] pw-mx-4 sm:pw-mx-0 pw-flex pw-flex-col pw-gap-[20px]">
        {isLoading || loadingAdminDeferred ? (
          <div className="pw-flex pw-gap-3 pw-justify-center pw-items-center">
            <Spinner className="pw-h-10 pw-w-10" />
          </div>
        ) : dataToUse()?.items?.length ? (
          dataToUse()?.items.map((item: any) => (
            <StatementComponentSDK
              future
              isAdmin={isAdmin}
              key={generateRandomUUID()}
              statement={{
                deliverId: item?.metadata?.deliverId ?? '',
                buyerName: item?.metadata?.buyerName ?? '',
                buyerEmail: item?.metadata?.buyerEmail ?? '',
                executeAt: item?.executeAt ?? '',
                pointsPrecision:
                  loyaltyWalletDefined?.pointsPrecision ?? 'integer',
                id: item?.id,
                createdAt: new Date(item?.createdAt),
                type: item?.type,
                status: item?.status,
                loyaltieTransactions: item?.loyaltiesTransactions,
                amount: parseFloat(item?.request?.amount ?? item?.amount),
                description: '',
                currency: loyaltyWallet?.length
                  ? loyaltyWallet[0]?.currency
                  : '',
                transactionType: 'receiving',
                metadata: item?.metadata,
              }}
            />
          ))
        ) : (
          <div className="pw-flex pw-gap-3 pw-justify-center pw-items-center">
            Nenhum lançamento futuro
          </div>
        )}
        {dataToUse()?.meta && (dataToUse()?.meta?.totalPages ?? 0) > 1 ? (
          <div className="pw-mt-4">
            <Pagination
              pagesQuantity={dataToUse()?.meta.totalPages ?? 0}
              currentPage={actualPage}
              onChangePage={setActualPage}
            />
          </div>
        ) : null}
      </div>
    </InternalPagesLayoutBase>
  );
};
