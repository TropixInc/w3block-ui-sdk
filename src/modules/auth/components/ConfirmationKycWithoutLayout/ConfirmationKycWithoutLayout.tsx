/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash';

import { PRACTITIONER_DATA_INFO_KEY } from '../../../checkout/config/keys/localStorageKey';
import { useProfile, useRouterConnect } from '../../../shared';
import { Box } from '../../../shared/components/Box/Box';
import { Spinner } from '../../../shared/components/Spinner';
import { WeblockButton } from '../../../shared/components/WeblockButton/WeblockButton';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useGetStorageData } from '../../../shared/hooks/useGetStorageData/useGetStorageData';
import { useGetTenantInfoByHostname } from '../../../shared/hooks/useGetTenantInfoByHostname';
import { useGetTenantInputsBySlug } from '../../../shared/hooks/useGetTenantInputs/useGetTenantInputsBySlug';
import { useGetUsersDocuments } from '../../../shared/hooks/useGetUsersDocuments';

export const ConfirmationKycWithoutLayout = () => {
  const router = useRouterConnect();
  const { data: profile } = useProfile();
  const { data: companyInfo } = useGetTenantInfoByHostname();
  const isPasswordless = companyInfo?.configuration?.passwordless?.enabled;
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

  function getDocumentByInputId(inputId: string) {
    return documents?.data.find((doc) => doc.inputId === inputId);
  }

  const groupedInputs = _.groupBy(tenantInputs?.data, 'step');

  const onContinue = () => {
    if (storageData.postKycUrl) router.pushConnect(storageData.postKycUrl);
    else if (isPasswordless) router.pushConnect('/');
    else
      router.pushConnect(PixwayAppRoutes.CONNECT_EXTERNAL_WALLET, router.query);
  };

  if (isLoadingKyc)
    return (
      <div className="pw-mt-20 pw-w-full pw-flex pw-items-center pw-justify-center">
        <Spinner />
      </div>
    );
  else
    return (
      <Box>
        <div className="pw-flex pw-flex-col pw-items-center">
          <p className="pw-font-poppins sm:pw-text-[24px] pw-text-lg pw-text-[#35394C] pw-font-[700] pw-text-center pw-max-w-[369px]">
            Confirme suas informações
          </p>
          {storageData?.certificate ? (
            <div className="pw-text-sm pw-font-poppins pw-text-black pw-text-left pw-flex pw-flex-col pw-items-start pw-justify-center pw-w-full pw-mt-5">
              <h2 className="pw-font-semibold">Informações da certificação</h2>
              <h3 className="pw-font-semibold pw-mt-[14px]">Nome completo</h3>
              <p className="pw-font-normal">{storageData?.certificate?.name}</p>
              <h3 className="pw-font-semibold pw-mt-[14px]">Academia</h3>
              <p className="pw-font-normal">
                {storageData?.certificate?.academy}
              </p>
              <h3 className="pw-font-semibold pw-mt-[14px]">
                Nome do professor
              </h3>
              <p className="pw-font-normal">
                {storageData?.certificate?.master}
              </p>
              <h3 className="pw-font-semibold pw-mt-[14px]">
                Data da cerimônia
              </h3>
              <p className="pw-font-normal">
                {storageData?.certificate?.certificationDate}
              </p>
              <h3 className="pw-font-semibold pw-mt-[14px]">Conquista</h3>
              <p className="pw-font-normal">
                {storageData?.certificate?.title}
              </p>
              <div className="pw-w-full pw-border-[2px] pw-border-black pw-mt-5"></div>
            </div>
          ) : null}
          {Object.keys(groupedInputs).map((res) => {
            return (
              <div key={res} className="pw-w-full pw-mt-5">
                <p className="pw-text-sm pw-font-semibold pw-font-poppins pw-text-black pw-text-left pw-w-full">
                  Informações pessoais{' '}
                  {Object.keys(groupedInputs).length > 1
                    ? res + ' de ' + Object.keys(groupedInputs).length
                    : null}
                  <button
                    className="pw-underline pw-text-blue-400 pw-ml-3"
                    onClick={() =>
                      router.pushConnect(PixwayAppRoutes.COMPLETE_KYC, {
                        step: res,
                        ...router.query,
                      })
                    }
                  >
                    Editar
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
                          : `Passaporte - ${(complexValue as any)?.document}`;
                      } else return '';
                    } else if (res?.type === 'simple_location') {
                      if (complexValue) {
                        return `${(complexValue as any)?.city}, ${
                          (complexValue as any)?.region
                        } / ${(complexValue as any)?.country}`;
                      } else return '';
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
                        <p className="pw-font-normal">{value()}</p>
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
            Continuar
          </WeblockButton>
        </div>
      </Box>
    );
};
