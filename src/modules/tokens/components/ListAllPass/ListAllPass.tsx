import { useState } from 'react';
import { useDebounce } from 'react-use';

import classNames from 'classnames';

import { InternalPagesLayoutBase } from '../../../shared';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import useIsMobile from '../../../shared/hooks/useIsMobile/useIsMobile';
import useRouter from '../../../shared/hooks/useRouter';
import useTranslation from '../../../shared/hooks/useTranslation';
import { usePublicTokenData } from '../../hooks/usePublicTokenData';
import { Breadcrumb } from '../Breadcrumb';
import { Filters, ValidStatusProps } from '../Filters';
import GenericTable from '../GenericTable/GenericTable';
import { InternalPageTitle } from '../InternalPageTitle';
import { LineDivider } from '../LineDivider';
import {
  headers,
  mobileHeaders,
  mobileTableData,
  tableData,
} from '../TokenDetailsCard';

const _ListAllPass = () => {
  const router = useRouter();
  const [translate] = useTranslation();
  const isMobile = useIsMobile();
  const contractAddress = (router.query.contractAddress as string) ?? '';
  const chainId = (router.query.chainId as string) ?? '';
  const tokenId = (router.query.tokenId as string) ?? '';
  const { data: publicTokenResponse } = usePublicTokenData({
    contractAddress,
    chainId,
    tokenId,
  });

  const status = {
    Ativo: '#009A6C',
    Inativo: '#ED4971',
    Indisponível: '#777E8F',
  };

  const validStatus: ValidStatusProps[] = [
    {
      key: 'Ativo',
      statusColor: '#009A6C',
    },
    {
      key: 'Inativo',
      statusColor: '#ED4971',
    },
    {
      key: 'Indisponível',
      statusColor: '#777E8F',
    },
  ];

  const [filteredData, setFilteredData] = useState(tableData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(Object.keys(status));

  useDebounce(
    () => {
      const filter = searchTerm.toLowerCase();
      const filteredData = tableData.filter(
        (item) =>
          (item.pass.toLowerCase().includes(filter) ||
            item.type.toLowerCase().includes(filter)) &&
          Boolean(
            statusFilter.find(
              (e) =>
                e.toLowerCase() === item?.status?.props?.status?.toLowerCase()
            )
          )
      );

      setFilteredData(filteredData);
    },
    500,
    [searchTerm, statusFilter]
  );

  const handleStatusFilter = (filter: string) => {
    const filterLowerCase = filter.toLocaleLowerCase();
    const hasFilter = statusFilter.find(
      (e) => e.toLocaleLowerCase() === filterLowerCase
    );

    if (hasFilter) {
      const filtered = statusFilter.filter(
        (e) => e.toLocaleLowerCase() !== filterLowerCase
      );
      setStatusFilter(filtered);
    } else {
      setStatusFilter((e) => [...e, filter]);
    }
  };

  const breadcrumbItems = [
    {
      url: '/tokens',
      name: 'Meus Tokens',
    },
    {
      url: '',
      name: publicTokenResponse?.data?.information?.title ?? '',
    },
    {
      url: '',
      name: translate('connect>ListAllPass>listBenefits'),
    },
  ];
  return publicTokenResponse ? (
    <div
      className={classNames(
        'pw-flex pw-flex-col pw-p-[17px] sm:pw-p-6 pw-bg-white pw-relative pw-rounded-[20px] pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] pw-mx-[22px] sm:pw-mx-0'
      )}
    >
      <Breadcrumb breadcrumbItems={breadcrumbItems} />
      <InternalPageTitle
        contract={publicTokenResponse?.data?.information?.contractName}
        title={publicTokenResponse?.data?.information?.title}
      />
      <LineDivider />
      <p className="pw-font-poppins pw-font-semibold pw-text-[15px] pw-text-black pw-mb-6">
        {translate('connect>ListAllPass>tableTitle')}
      </p>
      <Filters
        setSearchTerm={setSearchTerm}
        setStatus={handleStatusFilter}
        status={statusFilter}
        totalItens={filteredData.length}
        validStatus={validStatus}
      />
      <div className="pw-mt-4">
        {isMobile ? (
          <GenericTable
            columns={mobileHeaders}
            data={mobileTableData}
            showPagination={true}
          />
        ) : (
          <GenericTable
            columns={headers}
            data={filteredData}
            showPagination={true}
          />
        )}
      </div>
    </div>
  ) : null;
};

export const ListAllPass = () => (
  <TranslatableComponent>
    <InternalPagesLayoutBase>
      <_ListAllPass />
    </InternalPagesLayoutBase>
  </TranslatableComponent>
);
