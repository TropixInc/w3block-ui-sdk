import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ConfigTimeComponent } from '../../pass/components/ConfigTimeComponent';
import useGetPassBenefitById from '../../pass/hooks/useGetPassBenefitById';
import useGetPassById from '../../pass/hooks/useGetPassById';
import LabelWithRequired from '../../shared/components/LabelWithRequired';
import { Spinner } from '../../shared/components/Spinner';
import { useDynamicString } from '../hooks/useDynamicString';
import { PassBenefitData } from '../interfaces';

interface PassBenefitProps {
  data: PassBenefitData;
}

export const PassBenefit = ({ data }: PassBenefitProps) => {
  const [activeTab, setActiveTab] = useState('mon');
  const [translate] = useTranslation();

  const {
    benefitDescription,
    benefitId,
    benefitName,
    benefitRules,
    collectionImage,
    collectionName,
    eventValidity,
    limitUsages,
    links,
    passDescription,
    passName,
    passRules,
    avaliableTime,
  } = data.styleData;

  const { text: benefitIdDynamic } = useDynamicString(benefitId);

  console.log(benefitIdDynamic, 'benefitIdDynamic');

  const {
    data: benefit,
    isSuccess: isBenefitSucceed,
    isLoading: isLoadingBenefit,
  } = useGetPassBenefitById(benefitIdDynamic ?? '');

  const { data: tokenPass } = useGetPassById(benefit?.data?.tokenPassId ?? '');

  const renderLimitUsages = (usages: null | string | number) => {
    if (!usages || usages == null || usages == 0) {
      return translate('constructor>passBenefit>indeterminate');
    } else {
      return usages;
    }
  };

  return (
    <div className="!pw-w-full pw-flex pw-gap-4 pw-flex-col pw-justify-center pw-items-center pw-py-10 pw-container pw-mx-auto pw-gap-x-6 pw-flex-wrap">
      <div className="pw-w-full pw-max-w-[500px] pw-p-6 pw-border pw-border-slate-200 pw-rounded-lg pw-shadow-[0px 0px 5px 4px rgba(0,0,0,0.05)]">
        {collectionName && tokenPass?.data?.tokenName ? (
          <p className="pw-text-2xl pw-font-medium pw-text-black pw-mb-4">
            {tokenPass?.data?.tokenName}
          </p>
        ) : null}

        {collectionImage && tokenPass?.data?.imageUrl ? (
          <img
            className="pw-mt-2 pw-rounded-lg pw-w-full"
            src={tokenPass?.data?.imageUrl}
            alt=""
          />
        ) : null}

        {passName && tokenPass?.data?.name ? (
          <div className="pw-flex pw-gap-x-2 pw-items-center">
            <LabelWithRequired>
              <span className="pw-text-base">
                {translate('components>menu>tokenPass')}
              </span>
            </LabelWithRequired>
            <p className="pw-text-slate-700">{tokenPass?.data?.name}</p>
          </div>
        ) : null}
        {passDescription && tokenPass?.data?.description ? (
          <div className="">
            <LabelWithRequired>
              <span className="pw-text-base">
                {translate('commerce>productPage>description')}
              </span>
            </LabelWithRequired>
            <p className="pw-text-slate-700 pw-mt-1">
              {tokenPass?.data?.description}
            </p>
          </div>
        ) : null}
        {passRules && tokenPass?.data?.rules ? (
          <div className="">
            <LabelWithRequired>
              <span className="pw-text-base">
                {translate('token>pass>rules')}
              </span>
            </LabelWithRequired>
            <p className="pw-text-slate-700 pw-mt-1">
              {tokenPass?.data?.rules}
            </p>
          </div>
        ) : null}
      </div>
      {isLoadingBenefit ? <Spinner /> : null}
      {!isLoadingBenefit && isBenefitSucceed ? (
        <div className="pw-w-full pw-max-w-[500px] pw-p-6 pw-border pw-border-slate-200 pw-rounded-lg pw-shadow-[0px 0px 5px 4px rgba(0,0,0,0.05)]">
          {benefitName && benefit?.data?.name ? (
            <p className="pw-text-2xl pw-font-medium pw-text-black pw-mb-4">
              {benefit?.data?.name}
            </p>
          ) : null}

          {benefitDescription && benefit?.data?.description ? (
            <div className="">
              <LabelWithRequired>
                <span className="pw-text-base">
                  {translate('commerce>productPage>description')}
                </span>
              </LabelWithRequired>
              <p className="pw-text-slate-700 pw-mt-1">
                {benefit?.data?.description}
              </p>
            </div>
          ) : null}

          {benefitRules && benefit?.data?.rules ? (
            <div className="">
              <LabelWithRequired>
                <span className="pw-text-base">
                  {translate('token>pass>rules')}
                </span>
              </LabelWithRequired>
              <p className="pw-text-slate-700 pw-mt-1">
                {benefit?.data?.rules}
              </p>
            </div>
          ) : null}

          {limitUsages ? (
            <div className="pw-flex pw-gap-x-2 pw-items-center">
              <LabelWithRequired>
                <span className="pw-text-base">
                  {translate('constructor>passBenefit>limitUsages')}
                </span>
              </LabelWithRequired>
              <p className="pw-text-slate-700">
                {renderLimitUsages(benefit?.data?.useLimit)}
              </p>
            </div>
          ) : null}

          {eventValidity && benefit?.data?.eventStartsAt ? (
            <div className="pw-flex pw-gap-x-2 pw-items-center">
              <LabelWithRequired>
                <span className="pw-text-base">
                  {translate('constructor>passBenefit>eventStartAt')}
                </span>
              </LabelWithRequired>
              <p className="pw-text-slate-700">
                {new Date(benefit?.data?.eventStartsAt).toLocaleString()}
              </p>
            </div>
          ) : null}

          {eventValidity && benefit?.data?.eventEndsAt ? (
            <div className="pw-flex pw-gap-x-2 pw-items-center">
              <LabelWithRequired>
                <span className="pw-text-base">
                  {translate('constructor>passBenefit>eventEndAt')}
                </span>
              </LabelWithRequired>
              <p className="pw-text-slate-700">
                {new Date(benefit?.data?.eventEndsAt).toLocaleString()}
              </p>
            </div>
          ) : null}

          {links && benefit?.data?.linkUrl ? (
            <div className="pw-flex pw-gap-x-2 pw-items-center">
              <LabelWithRequired>
                <span className="pw-text-base">
                  {' '}
                  {translate('constructor>passBenefit>linkUrl')}
                </span>
              </LabelWithRequired>
              <p className="pw-text-slate-700">{benefit?.data?.linkUrl}</p>
            </div>
          ) : null}

          {links && benefit?.data?.linkRules ? (
            <div className="pw-flex pw-gap-x-2 pw-items-center">
              <LabelWithRequired>
                <span className="pw-text-base">
                  {translate('constructor>passBenefit>detailsRules')}
                </span>
              </LabelWithRequired>
              <p className="pw-text-slate-700">{benefit?.data?.linkRules}</p>
            </div>
          ) : null}

          {avaliableTime && benefit?.data?.checkIn ? (
            <div className="pw-mt-5 !pw-max-w-[500px]">
              <ConfigTimeComponent
                panelItems={benefit?.data?.checkIn[activeTab ?? '']}
                activeTab={activeTab}
                onChangeActiveTab={setActiveTab}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
