import { lazy, useState } from 'react';
import { useDebounce } from 'react-use';

import classNames from 'classnames';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
const InternalPagesLayoutBase = lazy(() =>
  import('../../../shared/components/InternalPagesLayoutBase').then((mod) => ({
    default: mod.InternalPagesLayoutBase,
  }))
);

import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import useIsMobile from '../../../shared/hooks/useIsMobile/useIsMobile';
import { useIsProduction } from '../../../shared/hooks/useIsProduction';
import useTranslation from '../../../shared/hooks/useTranslation';
const Breadcrumb = lazy(() =>
  import('../../../tokens/components/Breadcrumb').then((mod) => ({
    default: mod.Breadcrumb,
  }))
);
const Button = lazy(() =>
  import('../../../tokens/components/Button').then((mod) => ({
    default: mod.Button,
  }))
);

import { Filters, ValidStatusProps } from '../../../tokens/components/Filters';
import GenericTable from '../../../tokens/components/GenericTable/GenericTable';
import { InternalPageTitle } from '../../../tokens/components/InternalPageTitle';
import { LineDivider } from '../../../tokens/components/LineDivider';
import StatusTag from '../../../tokens/components/StatusTag/StatusTag';
import {
  headers,
  mobileHeaders,
} from '../../../tokens/const/GenericTableHeaders';
import { usePublicTokenData } from '../../../tokens/hooks/usePublicTokenData';
import { BenefitStatus } from '../../enums/BenefitStatus';
import { PassType } from '../../enums/PassType';
import useGetPassBenefitsByContractToken from '../../hooks/useGetPassBenefitsByContractToken';
import { BenefitAddress } from '../../interfaces/PassBenefitDTO';

interface Props {
  chainId: string;
  contractAddress: string;
  tokenId: string;
}

const _ListAllPass = ({ chainId, contractAddress, tokenId }: Props) => {
  const [translate] = useTranslation();
  const isMobile = useIsMobile();

  const router = useRouter();

  const payload = {
    chainId: chainId ?? (router?.query?.chainId as string),
    contractAddress:
      contractAddress ?? (router?.query?.contractAddress as string),
    tokenId: tokenId ?? (router?.query?.tokenId as string),
  };

  const { data: publicTokenResponse } = usePublicTokenData(payload);

  const { data: benefitsList } = useGetPassBenefitsByContractToken({
    editionNumber: publicTokenResponse?.data?.edition?.currentNumber,
    collectionId: publicTokenResponse?.data?.group?.collectionId,
  });

  const isProduction = useIsProduction();
  const isDevelopment = !isProduction;

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

  const handleLocal = (type: string, address?: BenefitAddress) => {
    if (type == PassType.physical && address) {
      return `${address.street} - ${address.city}`;
    }

    if (type == PassType.digital) {
      return 'Aplicativo';
    }
  };

  const formatDateToTable = (startsAt: string, endsAt?: string) => {
    if (endsAt) {
      return `${format(new Date(startsAt), 'dd/MM/yyyy')} > ${format(
        new Date(endsAt),
        'dd/MM/yyyy'
      )}`;
    } else {
      return format(new Date(startsAt), 'dd/MM/yyyy');
    }
  };

  const handleButtonToShow = (status: BenefitStatus) => {
    if (status == BenefitStatus.active) {
      return <Button>{translate('token>pass>benefits>useBenefit')}</Button>;
    } else {
      return (
        <Button variant="secondary">
          {translate('token>pass>benefits>viewBenefit')}
        </Button>
      );
    }
  };

  const tableData = benefitsList?.data?.items?.map((benefit) => ({
    name: benefit.name,
    type: benefit.type,
    local: benefit?.tokenPassBenefitAddresses
      ? handleLocal(benefit.type, benefit?.tokenPassBenefitAddresses[0])
      : handleLocal(benefit.type),
    date: formatDateToTable(benefit.eventStartsAt, benefit?.eventEndsAt),
    status: <StatusTag status={benefit.status} />,
    actionComponent: handleButtonToShow(benefit.status),
  }));

  const mobileTableData = benefitsList?.data?.items?.map((benefit) => ({
    name: benefit?.name,
    type: benefit?.type,
    status: <StatusTag status={benefit?.status} />,
    actionComponent: handleButtonToShow(benefit?.status),
  }));

  const [filteredData, setFilteredData] = useState(tableData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(Object.keys(status));

  useDebounce(
    () => {
      const filter = searchTerm?.toLowerCase();
      const filteredData = tableData?.filter(
        (item) =>
          (item?.name?.toLowerCase()?.includes(filter) ||
            item?.type?.toLowerCase()?.includes(filter)) &&
          Boolean(
            statusFilter.find(
              (e) =>
                e?.toLowerCase() === item?.status?.props?.status?.toLowerCase()
            )
          )
      );

      setFilteredData(filteredData);
    },
    500,
    [searchTerm, statusFilter]
  );

  const handleStatusFilter = (filter: string) => {
    const filterLowerCase = filter?.toLocaleLowerCase();
    const hasFilter = statusFilter.find(
      (e) => e?.toLocaleLowerCase() === filterLowerCase
    );

    if (hasFilter) {
      const filtered = statusFilter.filter(
        (e) => e?.toLocaleLowerCase() !== filterLowerCase
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
  return publicTokenResponse && isDevelopment ? (
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
        totalItens={filteredData?.length}
        validStatus={validStatus}
      />
      <div className="pw-mt-4">
        {isMobile && mobileTableData ? (
          <GenericTable
            columns={mobileHeaders}
            data={mobileTableData}
            showPagination={true}
            limitRowsNumber={5}
          />
        ) : null}
        {!isMobile && filteredData ? (
          <GenericTable
            columns={headers}
            data={filteredData}
            showPagination={true}
            limitRowsNumber={10}
          />
        ) : null}
      </div>
    </div>
  ) : null;
};

export const ListAllPass = ({ contractAddress, chainId, tokenId }: Props) => (
  <TranslatableComponent>
    <InternalPagesLayoutBase>
      <_ListAllPass
        chainId={chainId}
        contractAddress={contractAddress}
        tokenId={tokenId}
      />
    </InternalPagesLayoutBase>
  </TranslatableComponent>
);
