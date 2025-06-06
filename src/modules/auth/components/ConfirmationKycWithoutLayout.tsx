/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';
import { useInterval } from 'react-use';

import { DataTypesEnum } from '@w3block/sdk-id';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { PRACTITIONER_DATA_INFO_KEY } from '../../checkout/config/keys/localStorageKey';
import { Box } from '../../shared/components/Box';
import { SelectorRead } from '../../shared/components/SmartInputs/SelectorRead';
import { Separator } from '../../shared/components/SmartInputs/Separator';
import { InputDataDTO } from '../../shared/components/SmartInputsController';
import { Spinner } from '../../shared/components/Spinner';
import { WeblockButton } from '../../shared/components/WeblockButton';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useGetStorageData } from '../../shared/hooks/useGetStorageData';
import { useGetTenantContextBySlug } from '../../shared/hooks/useGetTenantContextBySlug';
import { useGetTenantInputsBySlug } from '../../shared/hooks/useGetTenantInputsBySlug';
import { useGetUsersDocuments } from '../../shared/hooks/useGetUsersDocuments';
import { useProfile } from '../../shared/hooks/useProfile';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { useThemeConfig } from '../../storefront/hooks/useThemeConfig';
import { useGetOrderByKyc } from '../../shared/hooks/useGetOrderByKyc';


export const ConfirmationKycWithoutLayout = () => {
  const router = useRouterConnect();
  const [translate] = useTranslation();
  const { data: profile } = useProfile();
  const theme = useThemeConfig();
  const skipWallet =
    theme?.defaultTheme?.configurations?.contentData?.skipWallet;
  const storageData = useGetStorageData(
    PRACTITIONER_DATA_INFO_KEY,
    router?.query?.sessionId as string
  );
  const slug = () => {
    const querySlug = router.query.contextSlug;
    if (querySlug) return querySlug as string;
    else return 'signup';
  };
  const { data: tenantInputs, isLoading: isLoadingKyc } =
    useGetTenantInputsBySlug({
      slug: slug(),
    });

  const { data: documents } = useGetUsersDocuments({
    userId: profile?.data.id ?? '',
    contextId: tenantInputs?.data?.length
      ? tenantInputs?.data[0].contextId
      : '',
  });

  const { data: context } = useGetTenantContextBySlug(slug());

  function getDocumentByInputId(inputId: string) {
    return documents?.data.find((doc: { inputId: string; }) => doc.inputId === inputId);
  }

  const [awaitProduct, setAwaitProduct] = useState(false);
  const [poolStatus, setPoolStatus] = useState(false);
  useInterval(() => {
    if (poolStatus) {
      validateOrderStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, 3000);
  const { mutate: getStatus } = useGetOrderByKyc();
  const validateOrderStatus = () => {
    if (poolStatus) {
      const interval = setInterval(() => {
        getStatus(
          { kycUserContextId: router?.query?.userContextId as string },
          {
            onSuccess: (data) => {
              clearInterval(interval);
              if (data?.data?.id) {
                router.pushConnect(`/checkout/pay/${data?.data?.id}`);
              }
            },
            onError: () => {
              clearInterval(interval);
            },
          }
        );
      }, 3000);
    }
  };
  const inputsFiltered = useMemo(
    () =>
      tenantInputs?.data?.filter(
        (input: { type: DataTypesEnum; data: any; }) =>
          !(
            input.type === DataTypesEnum.Checkbox &&
            (input?.data as any)?.hidden
          )
      ),
    [tenantInputs?.data]
  );
  const groupedInputs = _.groupBy(inputsFiltered, 'step');
  const onContinue = () => {
    if ((context?.data as any)?.data?.postKyc === 'awaitProduct') {
      setPoolStatus(true);
      setAwaitProduct(true);
    } else if (typeof storageData?.postKycUrl === 'string')
      router.pushConnect(storageData?.postKycUrl);
    else if ((context?.data as any)?.data?.screenConfig?.postKycUrl) {
      router.pushConnect(
        (context?.data as any)?.data?.screenConfig?.postKycUrl
      );
    } else if (skipWallet) {
      if (router.query.callbackPath?.length) {
        router.pushConnect(router.query.callbackPath as string);
      } else if (router.query.callbackUrl?.length) {
        router.pushConnect(router.query.callbackUrl as string);
      } else if ((context?.data as any)?.data?.screenConfig?.postKycUrl) {
        router.pushConnect(
          (context?.data as any)?.data?.screenConfig?.postKycUrl
        );
      } else {
        router.pushConnect('/');
      }
    } else
      router.pushConnect(PixwayAppRoutes.CONNECT_EXTERNAL_WALLET, router.query);
  };

  if (isLoadingKyc)
    return (
      <div className="pw-mt-20 pw-w-full pw-flex pw-items-center pw-justify-center">
        <Spinner />
      </div>
    );
  else if (awaitProduct)
    return (
      <Box>
        <div className="pw-w-full pw-flex pw-flex-col pw-gap-4 pw-items-center pw-justify-center">
          <p className="pw-text-black pw-font-semibold pw-text-lg">
            {translate('auth>confirmationKycWithoutLayout>generateOrder')}
          </p>
          <Spinner />
        </div>
      </Box>
    );
  else
    return (
      <Box>
        <div className="pw-flex pw-flex-col pw-items-center">
          <p className="pw-font-poppins sm:pw-text-[24px] pw-text-lg pw-text-[#35394C] pw-font-[700] pw-text-center pw-max-w-[369px]">
            {translate('auth>confirmationKycWithoutLayout>confirmInfos')}
          </p>
          {storageData?.certificate ? (
            <div className="pw-text-sm pw-font-poppins pw-text-black pw-text-left pw-flex pw-flex-col pw-items-start pw-justify-center pw-w-full pw-mt-5">
              <h2 className="pw-font-semibold">
                {translate(
                  'auth>confirmationKycWithoutLayout>certificateInfos'
                )}
              </h2>
              <h3 className="pw-font-semibold pw-mt-[14px]">
                {translate('auth>confirmationKycWithoutLayout>fullName')}
              </h3>
              <p className="pw-font-normal">{storageData?.certificate?.name}</p>
              <h3 className="pw-font-semibold pw-mt-[14px]">
                {translate('auth>confirmationKycWithoutLayout>conquest')}
              </h3>
              <p className="pw-font-normal">
                {storageData?.certificate?.title}
              </p>
              <h3 className="pw-font-semibold pw-mt-[14px]">
                {translate('auth>confirmationKycWithoutLayout>teacherName')}
              </h3>
              <p className="pw-font-normal">
                {storageData?.certificate?.master}
              </p>
              <h3 className="pw-font-semibold pw-mt-[14px]">
                {translate('auth>confirmationKycWithoutLayout>academy')}
              </h3>
              <p className="pw-font-normal">
                {storageData?.certificate?.academy}
              </p>
              <h3 className="pw-font-semibold pw-mt-[14px]">
                {translate('auth>confirmationKycWithoutLayout>cerimonyDate')}
              </h3>
              <p className="pw-font-normal">
                {storageData?.certificate?.certificationDate}
              </p>
              <div className="pw-w-full pw-border-[2px] pw-border-black pw-mt-5"></div>
            </div>
          ) : null}
          {Object.keys(groupedInputs).map((res) => {
            return (
              <div key={res} className="pw-w-full pw-mt-5">
                <p className="pw-text-sm pw-font-semibold pw-font-poppins pw-text-black pw-text-left pw-w-full">
                  {translate('auth>confirmationKycWithoutLayout>personalInfos')}{' '}
                  {Object.keys(groupedInputs).length > 1
                    ? res + ' de ' + Object.keys(groupedInputs).length
                    : null}
                  <button
                    className="pw-underline pw-text-blue-400 pw-ml-3"
                    onClick={() =>
                      router.pushConnect(PixwayAppRoutes.COMPLETE_KYC, {
                        ...router.query,
                        step: res,
                        formState: 'remain',
                      })
                    }
                  >
                    {translate('auth>confirmationKycWithoutLayout>edit')}
                  </button>
                </p>
                {groupedInputs[res].map((res) => {
                  const value = () => {
                    const doc = getDocumentByInputId(res?.id);
                    const value = doc?.value;
                    const simpleValue = doc?.simpleValue;
                    const complexValue = doc?.complexValue;
                    if (res?.type === 'identification_document') {
                      if (complexValue) {
                        return (complexValue as any)?.docType === 'cpf'
                          ? `CPF - ${(complexValue as any)?.document}`
                          : (complexValue as any)?.docType === 'rg'
                          ? `RG - ${(complexValue as any)?.document}`
                          : `Passaporte - ${(complexValue as any)?.document}`;
                      } else return '';
                    } else if (res?.type === 'simple_location') {
                      if (_.has(res, 'data.placeType')) {
                        if (complexValue) {
                          return (complexValue as any)?.home;
                        } else return '';
                      } else {
                        if (complexValue) {
                          return `${(complexValue as any)?.city}, ${
                            (complexValue as any)?.region
                          } / ${(complexValue as any)?.country}`;
                        } else return '';
                      }
                    } else if (res?.type === 'checkbox') {
                      if (typeof complexValue === 'boolean') {
                        return complexValue ? 'Aceito' : 'Não Aceito';
                      }
                      return value;
                    } else if (
                      res?.type === 'dynamic_select' ||
                      res?.type === 'simple_select'
                    ) {
                      return (
                        <SelectorRead
                          configData={res?.data as InputDataDTO}
                          docValue={complexValue ?? simpleValue}
                          options={res?.options ?? []}
                          type={res?.type}
                        />
                      );
                    } else if (res?.type === 'separator') {
                      return (
                        <Separator
                          widgetType={(res?.data as any)?.widgetType}
                          separatorConfig={{
                            marginBottom: (res?.data as any)?.marginBottom,
                            marginTop: (res?.data as any)?.marginTop,
                            showLine: (res?.data as any)?.showLine,
                            text: (res?.data as any)?.text,
                            textAbove: (res?.data as any)?.textAbove,
                          }}
                          redirectConfig={{
                            bgColor: (res?.data as any)?.bgColor,
                            link: (res?.data as any)?.link,
                            target: (res?.data as any)?.target,
                            text: (res?.data as any)?.text,
                            textColor: (res?.data as any)?.textColor,
                          }}
                          className="!pw-mb-0"
                        />
                      );
                    } else if (res.type === 'image' || res.type === 'file') {
                      return (
                        <a
                          href={doc?.asset?.directLink as string}
                          target="_blank"
                          rel="noreferrer"
                          className="pw-text-blue-500 pw-underline"
                        >
                          {translate('components>confirmationKyc>file')}
                        </a>
                      );
                    } else if (simpleValue) return simpleValue;
                    else return value;
                  };
                  if (res.type !== 'multiface_selfie')
                    return (
                      <div
                        key={res.id}
                        className="pw-text-sm pw-font-poppins pw-text-black pw-text-left pw-flex pw-flex-col pw-items-start pw-justify-center pw-w-full"
                      >
                        <h3 className="pw-font-semibold pw-mt-[14px]">
                          {res.label}
                        </h3>
                        <p className="pw-font-normal pw-break-all">{value()}</p>
                      </div>
                    );
                })}
              </div>
            );
          })}
          <WeblockButton
            onClick={onContinue}
            className="pw-mt-4 pw-text-white"
            fullWidth={true}
          >
            {translate('components>advanceButton>continue')}
          </WeblockButton>
        </div>
      </Box>
    );
};
