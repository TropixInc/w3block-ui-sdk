/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';

import classNames from 'classnames';
import { format } from 'date-fns';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { BenefitStatus } from '../../../pass/enums/BenefitStatus';
import { PassType } from '../../../pass/enums/PassType';
import useGetPassBenefits from '../../../pass/hooks/useGetPassBenefits';
import { BenefitAddress } from '../../../pass/interfaces/PassBenefitDTO';
import { transformObjectToQuery } from '../../../pass/utils/transformObjectToQuery';
import { useRouterConnect } from '../../../shared';
import { ImageSDK } from '../../../shared/components/ImageSDK';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import useIsMobile from '../../../shared/hooks/useIsMobile/useIsMobile';
import { useIsProduction } from '../../../shared/hooks/useIsProduction';
import useTranslation from '../../../shared/hooks/useTranslation';
import { headers, mobileHeaders } from '../../const/GenericTableHeaders';
import { FormConfigurationContext } from '../../contexts/FormConfigurationContext';
import useDynamicDataFromTokenCollection from '../../hooks/useDynamicDataFromTokenCollection';
import {
  Dimensions2DValue,
  Dimensions3DValue,
} from '../../interfaces/DimensionsValue';
import { DynamicFormConfiguration } from '../../interfaces/DynamicFormConfiguration';
import { Breadcrumb } from '../Breadcrumb';
import { Button } from '../Button';
import GenericTable from '../GenericTable/GenericTable';
import { InternalPageTitle } from '../InternalPageTitle';
import { LineDivider } from '../LineDivider';
import { SmartDataDisplayer } from '../SmartDataDisplayer';
import { TextFieldDisplay } from '../SmartDisplay/TextFieldDisplay';
import StatusTag from '../StatusTag/StatusTag';

interface Props {
  contract: string;
  title: string;
  description: string;
  mainImage: string;
  tokenData: Record<string, string | Dimensions2DValue | Dimensions3DValue>;
  tokenTemplate: DynamicFormConfiguration;
  className?: string;
  isMultiplePass?: boolean;
  chainId?: string;
  contractAddress?: string;
  tokenId?: string;
  collectionId?: string;
}

export const TokenDetailsCard = ({
  contract,
  description,
  mainImage,
  title,
  tokenData,
  tokenTemplate,
  className = '',
  tokenId = '',
  chainId,
  contractAddress,
  collectionId,
}: Props) => {
  const [translate] = useTranslation();
  const isMobile = useIsMobile();
  const dynamicData = useDynamicDataFromTokenCollection(
    tokenData,
    tokenTemplate
  );
  const { pass } = useFlags();

  const { data: benefitsList, isSuccess } = useGetPassBenefits({
    tokenPassId: collectionId,
    chainId: chainId,
    contractAddress: contractAddress,
  });

  const isMultiplePass = useMemo(() => {
    if (isSuccess) {
      return benefitsList?.data?.items?.length > 0;
    }
  }, [benefitsList, isSuccess]);

  const router = useRouterConnect();

  const queryParams = {
    tokenId,
  };

  const renderTextValue = (label: string, value: string) => (
    <TextFieldDisplay label={label} value={value} inline />
  );

  const breadcrumbItems = [
    {
      url: '',
      name: 'Meus Tokens',
    },
    {
      url: '',
      name: title,
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

  const isProduction = useIsProduction();
  const isDevelopment = !isProduction;

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

  const handleButtonToShow = (status: BenefitStatus, id: string) => {
    if (status == BenefitStatus.active) {
      return (
        <Button
          onClick={() =>
            router.pushConnect(
              PixwayAppRoutes.USE_BENEFIT.replace('{benefitId}', id).concat(
                transformObjectToQuery(queryParams)
              )
            )
          }
        >
          {translate('token>pass>benefits>useBenefit')}
        </Button>
      );
    } else {
      return (
        <Button
          variant="secondary"
          onClick={() =>
            router.pushConnect(
              PixwayAppRoutes.USE_BENEFIT.replace('{benefitId}', id).concat(
                transformObjectToQuery(queryParams)
              )
            )
          }
        >
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
    actionComponent: handleButtonToShow(benefit.status, benefit.id),
  }));

  const mobileTableData = benefitsList?.data?.items?.map((benefit) => ({
    name: benefit?.name,
    type: benefit?.type,
    status: <StatusTag status={benefit?.status} />,
    actionComponent: handleButtonToShow(benefit?.status, benefit.id),
  }));

  return (
    <div
      className={classNames(
        className,
        'pw-flex pw-flex-col pw-p-[17px] sm:pw-p-6 pw-bg-white pw-relative pw-rounded-[20px] pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] pw-mx-[22px] sm:pw-mx-0'
      )}
    >
      <Breadcrumb breadcrumbItems={breadcrumbItems} />
      {pass ? <InternalPageTitle contract={contract} title={title} /> : null}
      {isMultiplePass && isDevelopment && pass ? (
        <>
          <LineDivider />
          <div className="pw-flex pw-flex-col pw-gap-6">
            <p className="pw-font-poppins pw-font-semibold pw-text-[15px] pw-text-black">
              {translate('connect>TokenDetailCard>passAssociated')}
            </p>
            {isMobile && mobileTableData ? (
              <GenericTable
                columns={mobileHeaders}
                data={mobileTableData}
                limitRowsNumber={3}
                itensPerPage={3}
              />
            ) : null}
            {!isMobile && tableData ? (
              <GenericTable
                columns={headers}
                data={tableData}
                limitRowsNumber={5}
                itensPerPage={5}
              />
            ) : null}
          </div>
        </>
      ) : null}
      <LineDivider />
      {mainImage || description ? (
        <div className="pw-grid pw-grid-cols-1 sm:pw-grid-cols-2 pw-gap-x-[21px] pw-gap-y-4 sm:pw-py-6 sm:pw-gap-y-8 pw-w-full pw-break-words">
          {description ? (
            renderTextValue(
              translate('connect>tokenDetailsCard>description'),
              description
            )
          ) : (
            <div className="pw-hidden sm:pw-block" />
          )}
          <div className="pw-flex pw-justify-center">
            <ImageSDK
              controls={true}
              className="pw-max-w-full pw-max-h-[351px] pw-object-contain pw-rounded-[12px] pw-overflow-hidden pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)]"
              src={mainImage}
              alt=""
            />
          </div>
        </div>
      ) : null}
      <LineDivider />
      {dynamicData ? (
        <FormConfigurationContext.Provider value={tokenTemplate ?? {}}>
          <div className="pw-grid pw-grid-cols-1 sm:pw-grid-cols-2 pw-gap-x-[21px] pw-gap-y-8 sm:pw-gap-y-8 sm:pw-pt-6 pw-break-words">
            {dynamicData.map(({ id, value }: { id: any; value: any }) => (
              <SmartDataDisplayer
                fieldName={id}
                key={id}
                value={value}
                inline
                classes={{
                  label: 'pw-font-medium',
                }}
              />
            ))}
          </div>
        </FormConfigurationContext.Provider>
      ) : null}
    </div>
  );
};
