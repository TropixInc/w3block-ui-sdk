import { useState } from 'react';
import { useDebounce } from 'react-use';

import classNames from 'classnames';

import { InternalPagesLayoutBase } from '../../../shared';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import useIsMobile from '../../../shared/hooks/useIsMobile/useIsMobile';
import useRouter from '../../../shared/hooks/useRouter';
import useTranslation from '../../../shared/hooks/useTranslation';
import { useUserWallet } from '../../../shared/hooks/useUserWallet';
import { Breadcrumb } from '../../../tokens/components/Breadcrumb';
import { Filters, ValidStatusProps } from '../../../tokens/components/Filters';
import GenericTable from '../../../tokens/components/GenericTable/GenericTable';
import { LineDivider } from '../../../tokens/components/LineDivider';
import {
  headers,
  mobileHeaders,
  mobileTableData,
  tableData,
} from '../../../tokens/components/TokenDetailsCard';
import { usePublicTokenData } from '../../../tokens/hooks/usePublicTokenData';
import useGetPassBenefitsByContractToken from '../../hooks/useGetPassBenefitsByContractToken';

const _ListAllPass = () => {
  const router = useRouter();
  const [translate] = useTranslation();
  const isMobile = useIsMobile();
  const { wallet } = useUserWallet();

  const contractAddress = '0x4f47a2218ee5c786943f1476a6b75624b3a7eee0';
  const chainId = '80001';
  const tokenId = (router.query.tokenId as string) ?? '';

  const { data: publicTokenResponse } = usePublicTokenData({
    contractAddress,
    chainId,
    tokenId,
  });

  const benefitsList = useGetPassBenefitsByContractToken(
    chainId,
    contractAddress,
    tokenId
  );

  console.log({ wallet, benefitsList });

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
  return !publicTokenResponse ? (
    <div
      className={classNames(
        'pw-flex pw-flex-col pw-p-[17px] sm:pw-p-6 pw-bg-white pw-relative pw-rounded-[20px] pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] pw-mx-[22px] sm:pw-mx-0'
      )}
    >
      <Breadcrumb breadcrumbItems={breadcrumbItems} />
      {/* <InternalPageTitle
        contract={publicTokenResponse?.data?.information?.contractName}
        title={publicTokenResponse?.data?.information?.title}
      /> */}
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
            limitRowsNumber={5}
          />
        ) : (
          <GenericTable
            columns={headers}
            data={filteredData}
            showPagination={true}
            limitRowsNumber={10}
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
