import { lazy, useMemo } from 'react';

const InternalPagesLayoutBase = lazy(() =>
  import(
    '../../../shared/components/InternalPagesLayoutBase/InternalPagesLayoutBase'
  ).then((mod) => ({ default: mod.InternalPagesLayoutBase }))
);

import ArrowLeftIcon from '../../../shared/assets/icons/arrowLeftOutlined.svg?react';
const Spinner = lazy(() =>
  import('../../../shared/components/Spinner').then((mod) => ({
    default: mod.Spinner,
  }))
);
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import useTranslation from '../../../shared/hooks/useTranslation';
const DetailPass = lazy(() =>
  import('../../../tokens/components/PassTemplate/DetailPass').then((mod) => ({
    default: mod.DetailPass,
  }))
);
const DetailsTemplate = lazy(() =>
  import('../../../tokens/components/PassTemplate/DetailsTemplate').then(
    (mod) => ({
      default: mod.DetailsTemplate,
    })
  )
);
const BenefitUsesList = lazy(() =>
  import('../BenefitUsesList/BenefitUsesList').then((mod) => ({
    default: mod.default,
  }))
);
import useGetPassBenefitById from '../../hooks/useGetPassBenefitById';
import useGetPassBenefits from '../../hooks/useGetPassBenefits';
import { TokenPassBenefitType } from '../../interfaces/PassBenefitDTO';
import { ErrorBox } from '../../../shared/components/ErrorBox';

interface BenefitDetailsProps {
  benefitIdProp?: string;
}

const _BenefitDetails = ({ benefitIdProp }: BenefitDetailsProps) => {
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const benefitId = benefitIdProp || (router?.query?.benefitId as string) || '';

  const {
    data: benefit,
    isLoading: isLoadingBenefit,
    error: errorBenefit,
  } = useGetPassBenefitById(benefitId);

  const { data: benefitsList, error: errorBenefitsList } = useGetPassBenefits({
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

  if (isLoadingBenefit) {
    return (
      <div className="pw-w-full pw-h-full pw-flex pw-justify-center pw-items-center">
        <Spinner />
      </div>
    );
  }
  return errorBenefit || errorBenefitsList ? (
    <>
      <ErrorBox customError={errorBenefit} />
      <ErrorBox customError={errorBenefitsList} />
    </>
  ) : (
    <div className="pw-bg-white pw-flex pw-flex-col pw-w-full sm:pw-rounded-[20px] sm:pw-p-[24px] sm:pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] pw-gap-[30px] pw-mb-10">
      <div
        className="pw-relative pw-flex pw-justify-center sm:pw-justify-start pw-items-center pw-gap-1 pw-cursor-pointer pw-text-[18px] pw-leading-[23px] pw-font-bold pw-text-[#353945]"
        onClick={() => router.back()}
      >
        <ArrowLeftIcon className="pw-absolute pw-left-0 sm:pw-relative pw-stroke-[#295BA6]" />

        <p className="sm:pw-hidden pw-block">{translate('token>pass>title')}</p>
        <p className="pw-hidden sm:pw-block">{translate('token>pass>back')}</p>
      </div>
      <div className="pw-hidden sm:pw-flex pw-justify-center sm:pw-justify-start pw-items-center pw-gap-1 pw-text-[24px] pw-leading-[36px] pw-font-bold pw-text-[#353945]">
        {translate('token>pass>title')}
      </div>
      <div className="pw-rounded-[16px] pw-border pw-border-[#EFEFEF] pw-py-[16px]">
        <div className="pw-ml-5 pw-text-[18px] pw-leading-[23px] pw-font-bold pw-text-[#295BA6]">
          {benefit?.data?.name}
        </div>
        <div className="pw-ml-5 pw-text-[14px] pw-leading-[21px] pw-font-normal pw-text-[#777E8F]">
          {translate('token>benefits>useLimit') + ' ' + benefit?.data?.useLimit}
        </div>
      </div>
      <DetailsTemplate title="Usos:" autoExpand>
        <BenefitUsesList benefitId={benefitId} />
      </DetailsTemplate>
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
};

export const BenefitDetails = () => (
  <TranslatableComponent>
    <InternalPagesLayoutBase>
      <_BenefitDetails />
    </InternalPagesLayoutBase>
  </TranslatableComponent>
);
