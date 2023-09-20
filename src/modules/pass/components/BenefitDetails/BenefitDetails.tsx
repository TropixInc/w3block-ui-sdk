import { useMemo } from 'react';

import { useFlags } from 'launchdarkly-react-client-sdk';

import { InternalPagesLayoutBase } from '../../../shared';
import { ReactComponent as ArrowLeftIcon } from '../../../shared/assets/icons/arrowLeftOutlined.svg';
import { Spinner } from '../../../shared/components/Spinner';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import useTranslation from '../../../shared/hooks/useTranslation';
import GenericTable, {
  ColumnType,
} from '../../../tokens/components/GenericTable/GenericTable';
import { DetailPass } from '../../../tokens/components/PassTemplate/DetailPass';
import { DetailsTemplate } from '../../../tokens/components/PassTemplate/DetailsTemplate';
import useGetPassBenefitById from '../../hooks/useGetPassBenefitById';
import useGetPassBenefits from '../../hooks/useGetPassBenefits';
import { TokenPassBenefitType } from '../../interfaces/PassBenefitDTO';

interface BenefitDetailsProps {
  benefitIdProp?: string;
}

interface DataTable {
  name?: string;
  date?: string;
  cpf?: string;
  tokenEdition?: number;
  timeOfUse?: string;
}

const _BenefitDetails = ({ benefitIdProp }: BenefitDetailsProps) => {
  const { pass } = useFlags();
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const benefitId = benefitIdProp || (router?.query?.benefitId as string) || '';

  const { data: benefit, isLoading: isLoadingBenefit } =
    useGetPassBenefitById(benefitId);

  const { data: benefitsList } = useGetPassBenefits({
    tokenPassId: benefit?.data?.tokenPassId,
    chainId: benefit?.data?.tokenPass?.chainId,
    contractAddress: benefit?.data?.tokenPass?.contractAddress,
  });

  const formattedData = useMemo(() => {
    const filteredData = benefitsList?.data?.items?.filter(
      (benefit) => benefit?.id === benefitId
    );
    const local = filteredData && filteredData[0]?.tokenPassBenefitAddresses;
    return local;
  }, [benefitId, benefitsList?.data?.items]);

  const headersUses: ColumnType<DataTable, keyof DataTable>[] = [
    { key: 'name', header: 'Nome' },
    { key: 'cpf', header: 'CPF' },
    { key: 'tokenEdition', header: 'Edição do Token' },
    { key: 'date', header: 'Data' },
    { key: 'timeOfUse', header: 'Hora do Uso' },
  ];

  const formatedDataUses: DataTable[] = [
    {
      name: 'Ricardo',
      cpf: '123.456.789-00',
      tokenEdition: 1,
      date: '11/04/2023',
      timeOfUse: '10h40',
    },
    {
      name: 'Sandra',
      cpf: '123.456.789-00',
      tokenEdition: 1,
      date: '12/06/2023',
      timeOfUse: '15h40',
    },
    {
      name: 'Angélica',
      cpf: '123.456.789-00',
      tokenEdition: 1,
      date: '10/03/2023',
      timeOfUse: '6h40',
    },
    {
      name: 'Eduardo',
      cpf: '123.456.789-00',
      tokenEdition: 1,
      date: '18/05/2023',
      timeOfUse: '14h40',
    },
    {
      name: 'Ana',
      cpf: '123.456.789-00',
      tokenEdition: 1,
      date: '24/08/2023',
      timeOfUse: '12h40',
    },
  ];

  if (isLoadingBenefit) {
    return (
      <div className="pw-w-full pw-h-full pw-flex pw-justify-center pw-items-center">
        <Spinner />
      </div>
    );
  }
  if (pass) {
    return (
      <div className="pw-flex pw-flex-col pw-w-full sm:pw-rounded-[20px] sm:pw-p-[24px] sm:pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] pw-gap-[30px] pw-mb-10">
        <div
          className="pw-relative pw-flex pw-justify-center sm:pw-justify-start pw-items-center pw-gap-1 pw-cursor-pointer pw-text-[18px] pw-leading-[23px] pw-font-bold pw-text-[#353945]"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon className="pw-absolute pw-left-0 sm:pw-relative pw-stroke-[#295BA6]" />

          <p className="sm:pw-hidden pw-block">
            {translate('token>pass>title')}
          </p>
          <p className="pw-hidden sm:pw-block">
            {translate('token>pass>back')}
          </p>
        </div>
        <div className="pw-hidden sm:pw-flex pw-justify-center sm:pw-justify-start pw-items-center pw-gap-1 pw-text-[24px] pw-leading-[36px] pw-font-bold pw-text-[#353945]">
          {translate('token>pass>title')}
        </div>
        <div className="pw-rounded-[16px] pw-border pw-border-[#EFEFEF] pw-py-[16px]">
          <div className="pw-ml-5 pw-text-[18px] pw-leading-[23px] pw-font-bold pw-text-[#295BA6]">
            {benefit?.data?.name}
          </div>
          <div className="pw-ml-5 pw-text-[14px] pw-leading-[21px] pw-font-normal pw-text-[#777E8F]">
            {translate('token>benefits>useLimit') +
              ' ' +
              benefit?.data?.useLimit}
          </div>
        </div>
        <div>
          <p className="pw-text-xl pw-font-bold pw-mb-3">Usos: </p>
          <GenericTable
            columns={headersUses}
            data={formatedDataUses}
            showPagination={true}
            limitRowsNumber={5}
            itensPerPage={5}
          />
        </div>
        <>
          <DetailsTemplate
            title={translate('token>benefits>details')}
            autoExpand={true}
          >
            <DetailPass
              title={translate('token>pass>description')}
              description={benefit?.data?.description ?? ''}
            />

            <DetailPass
              title={translate('token>pass>rules')}
              description={benefit?.data?.rules ?? ''}
            />
          </DetailsTemplate>

          {benefit?.data?.type == TokenPassBenefitType.PHYSICAL ? (
            <DetailsTemplate
              title={translate('token>pass>useLocale')}
              autoExpand={true}
            >
              {formattedData &&
                formattedData.map((address) => (
                  <div
                    key={address?.name}
                    className="pw-w-full pw-rounded-[16px] pw-p-[24px] pw-shadow-[0px_4px_15px_rgba(0,0,0,0.07)] pw-flex pw-flex-col pw-gap-2"
                  >
                    <div className="pw-flex pw-flex-col pw-gap-1">
                      <div className="pw-text-[18px] pw-leading-[23px] pw-font-bold pw-text-[#295BA6]">
                        {address?.name}
                      </div>
                      <div className="pw-text-[14px] pw-leading-[21px] pw-font-normal pw-text-[#777E8F]">
                        {address?.street && address?.street + ', '}
                        {address?.city && address?.city + ' - '}
                        {address?.state}
                      </div>
                    </div>
                    {address?.rules && (
                      <div className="pw-flex pw-flex-col pw-gap-1">
                        <div className="pw-text-[15px] pw-leading-[23px] pw-font-semibold pw-text-[#353945]">
                          {translate('token>pass>rules')}
                        </div>
                        <div className="pw-text-[14px] pw-leading-[21px] pw-font-normal pw-text-[#777E8F]">
                          {address?.rules}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </DetailsTemplate>
          ) : null}
        </>
      </div>
    );
  } else {
    return null;
  }
};

export const BenefitDetails = () => (
  <TranslatableComponent>
    <InternalPagesLayoutBase>
      <_BenefitDetails />
    </InternalPagesLayoutBase>
  </TranslatableComponent>
);
