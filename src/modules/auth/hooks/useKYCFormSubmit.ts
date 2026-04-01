/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react';

import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { usePostUsersDocuments } from '../../shared/hooks/usePostUsersDocuments';
import { useProfile } from '../../shared/hooks/useProfile';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { useUtms } from '../../shared/hooks/useUtms';
import { OnboardContext } from '../../shared/providers/OnboardProvider';

interface UseKYCFormSubmitParams {
  userId: string;
  slug: string;
  groupedInputs: Record<string, any>;
  tenantInputs: any;
  kycContext: any;
  skipWallet?: boolean;
  keyPage?: boolean;
  profilePage?: boolean;
  productForm?: boolean;
  handleProductForm?: () => void;
  handleProductFormError?: () => void;
  product?: {
    quantity: number;
    productId: string;
  };
  userContextId?: string;
  dynamicMethods: any;
}

export const useKYCFormSubmit = ({
  userId,
  slug,
  groupedInputs,
  tenantInputs,
  kycContext,
  skipWallet,
  keyPage,
  profilePage,
  productForm = false,
  handleProductForm,
  handleProductFormError,
  product,
  userContextId,
  dynamicMethods,
}: UseKYCFormSubmitParams) => {
  const router = useRouterConnect();
  const { companyId: tenantId } = useCompanyConfig();
  const { mutate, isSuccess, isError, isPending, error } =
    usePostUsersDocuments();
  const { refetch } = useProfile();
  const utms = useUtms();
  const context = useContext(OnboardContext);
  const contextOnboard = useContext(OnboardContext);

  const step = router.query && router.query.step && router.query.step;
  const query = Object.keys(router.query ?? {}).length > 0 ? router.query : '';

  const screenConfig = (kycContext?.data as any)?.data?.screenConfig;

  const onSubmit = () => {
    const dynamicValues = dynamicMethods.getValues();
    const documents = Object.values(dynamicValues);
    const validDocs = documents.filter((item: any) => item);

    const docsToUse = () => {
      if (
        tenantInputs?.data.some(
          (val: any) => (val.type as any) === 'commerce_product'
        ) &&
        product
      ) {
        const productInput = [
          {
            inputId: tenantInputs?.data?.find(
              (val: any) => (val.type as any) === 'commerce_product'
            )?.id,
            value: product,
          },
        ];
        const newDocs = validDocs.concat(productInput);
        return newDocs;
      } else return validDocs;
    };

    if (tenantInputs?.data?.length && userId) {
      const { contextId } = tenantInputs.data[0];
      const inputApprover = tenantInputs.data?.find(
        (val: any) => (val?.data as any)?.approver
      );
      const approver = docsToUse()?.find(
        (val: any) => val.inputId === inputApprover?.id
      );
      const value = () => {
        if (
          (kycContext?.data as any)?.requireSpecificApprover &&
          inputApprover &&
          approver
        ) {
          return {
            documents: docsToUse(),
            currentStep: parseInt(step as string),
            approverUserId: (approver as any)?.value?.userId ?? undefined,
            utmParams: utms ? { ...utms } : undefined,
            userContextId:
              userContextId ??
              (router?.query?.userContextId as string) ??
              undefined,
          };
        } else {
          return {
            documents: docsToUse(),
            currentStep: parseInt(step as string),
            utmParams: utms ? { ...utms } : undefined,
            userContextId:
              userContextId ??
              (router?.query?.userContextId as string) ??
              undefined,
          };
        }
      };
      mutate(
        {
          tenantId,
          contextId,
          userId,
          documents: value(),
        },
        {
          onSuccess: (data: { data: any }) => {
            if (!productForm) {
              contextOnboard.setLoading(true);
            }
            const steps = Object.keys(groupedInputs).length;
            if (steps && parseInt(step as string) < steps) {
              router.push({
                query: {
                  contextSlug: slug,
                  step: parseInt(step as string) + 1,
                  userContextId:
                    router?.query?.userContextId ?? (data.data as any).id,
                },
              });
            } else if (productForm && handleProductForm) {
              handleProductForm();
            } else if (!profilePage) {
              refetch();
              context.refetchDocs();
              if (keyPage) {
                null;
              } else if (screenConfig?.skipConfirmation) {
                if (typeof screenConfig?.postKycUrl === 'string') {
                  router.pushConnect(screenConfig?.postKycUrl);
                } else if (skipWallet) {
                  if (router.query.callbackPath?.length) {
                    router.pushConnect(router.query.callbackPath as string);
                  } else if (router.query.callbackUrl?.length) {
                    router.pushConnect(router.query.callbackUrl as string);
                  } else {
                    router.pushConnect('/');
                  }
                } else {
                  router.pushConnect(
                    PixwayAppRoutes.CONNECT_EXTERNAL_WALLET,
                    router.query
                  );
                }
              } else {
                router.pushConnect(
                  PixwayAppRoutes.COMPLETE_KYC_CONFIRMATION,
                  query
                );
              }
            }
          },
          onError() {
            if (productForm && handleProductFormError) {
              handleProductFormError();
            }
          },
        }
      );
    }
  };

  return { onSubmit, mutate, isSuccess, isError, isPending, error };
};
