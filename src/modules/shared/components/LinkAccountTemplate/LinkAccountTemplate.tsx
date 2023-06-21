import { useState } from 'react';

import useGetProductById from '../../../storefront/hooks/useGetProductById/useGetProductById';
import { useGetNFTSByWallet } from '../../../tokens/hooks/useGetNFTsByWallet';
import { mapNFTToToken } from '../../../tokens/utils/mapNFTToToken';
import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { useHasWallet, useProfile, useRouterConnect } from '../../hooks';
import { useAcceptIntegrationToken } from '../../hooks/useAcceptIntegrationToken/useAcceptIntegrationToken';
import { usePrivateRoute } from '../../hooks/usePrivateRoute';
import { useUserWallet } from '../../hooks/useUserWallet';
import { Alert } from '../Alert';
import { Box } from '../Box/Box';
import { Spinner } from '../Spinner';
import TranslatableComponent from '../TranslatableComponent';

enum Steps {
  DEFAULT = 'default',
  ERROR = 'error',
  SUCCESS = 'success',
}

const _LinkAccountTemplate = () => {
  const router = useRouterConnect();
  const fromTenantName = (router.query.fromTentant as string) ?? '';
  const toTenantName = (router.query.toTenant as string) ?? '';
  const toTenantId = (router.query.toTenantId as string) ?? '';
  const token = (router.query.token as string) ?? '';
  const fromEmail = (router.query.fromEmail as string) ?? '';
  const productId = (router.query.productId as string) ?? '';
  const productCollectionId = (router.query.collectionId as string) ?? '';
  const { data: profile } = useProfile();
  const { mutate: acceptIntegration, isLoading } = useAcceptIntegrationToken();
  const [step, setSteps] = useState('');

  const { wallet } = useUserWallet();
  const [{ data: ethNFTsResponse }] = useGetNFTSByWallet(
    wallet?.chainId || 80001
  );
  const tokens =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethNFTsResponse?.data.items.map((nft: any) =>
      mapNFTToToken(nft, wallet?.chainId || 80001)
    ) || [];
  const userHasProduct = tokens.some(
    (data) => data.collectionData.id === productCollectionId
  );

  const { data: product } = useGetProductById(productId);

  const handleClose = () => {
    window.close();
  };

  const renderInternal = () => {
    switch (step) {
      case Steps.ERROR:
        return (
          <>
            <Alert variant="error">
              <Alert.Icon />
              Erro ao fazer a integração
            </Alert>
            <div className="pw-mt-4 pw-flex pw-flex-row pw-gap-3 pw-justify-center pw-items-center">
              <button
                onClick={handleClose}
                className="pw-px-[24px] pw-h-[33px] pw-bg-[#EFEFEF] pw-border-[#779bcf] pw-rounded-[48px] pw-border pw-font-poppins pw-font-medium pw-text-xs"
              >
                Fechar
              </button>
            </div>
          </>
        );
      case Steps.SUCCESS:
        return (
          <>
            {productId != '' ? (
              userHasProduct ? (
                <p className="pw-text-black pw-font-medium pw-text-xl">
                  Pronto, agora sua conta está vinculada! Você já possui o token
                  necessário para realizar a compra em <b>{fromTenantName}</b>,
                  já pode retornar a janela anterior e continuar com a sua
                  compra!
                </p>
              ) : (
                <Spinner className="pw-mx-auto" />
              )
            ) : (
              <p className="pw-text-black pw-font-medium pw-text-xl">
                Pronto, agora sua conta está vinculada! Agora tokens adquiridos
                na sua conta <b>{toTenantName}</b> lhe darão acesso a ofertas
                exclusivas na sua conta <b>{fromTenantName}</b>.
              </p>
            )}
            <div className="pw-mt-4 pw-flex pw-flex-row pw-gap-3 pw-justify-center pw-items-center">
              <button
                onClick={handleClose}
                className="pw-px-[24px] pw-h-[33px] pw-bg-[#EFEFEF] pw-border-[#295BA6] pw-rounded-[48px] pw-border pw-font-poppins pw-font-medium pw-text-xs"
              >
                Fechar
              </button>
            </div>
          </>
        );
      default:
        return (
          <>
            <p className="pw-text-black pw-font-medium pw-text-xl pw-text-center pw-break-words">
              Tem certeza que deseja vincular sua conta <b>{fromTenantName}</b>{' '}
              (email: {fromEmail}) à sua conta <b>{toTenantName}</b> (email:{' '}
              {profile?.data?.email}
              )?
            </p>
            <div className="pw-mt-4 pw-flex pw-flex-row pw-gap-3 pw-justify-center pw-items-center">
              <button
                onClick={handleClose}
                className="pw-px-[24px] pw-h-[33px] pw-bg-[#EFEFEF] pw-border-[#295BA6] pw-rounded-[48px] pw-border pw-font-poppins pw-font-medium pw-text-xs"
              >
                Não
              </button>
              <button
                onClick={handleAccept}
                className="pw-px-[24px] pw-h-[33px] pw-bg-brand-primary pw-border-[#295BA6] pw-rounded-[48px] pw-border pw-font-poppins pw-font-medium pw-text-xs pw-text-white"
              >
                Sim
              </button>
            </div>
          </>
        );
    }
  };

  const handleAccept = () => {
    acceptIntegration(
      { token, tenantId: toTenantId },
      {
        onError() {
          setSteps(Steps.ERROR);
        },
        onSuccess() {
          if (productId != '' && !userHasProduct) {
            router.pushConnect(
              PixwayAppRoutes.PRODUCT_PAGE.replace(
                '{slug}',
                product?.slug ?? ''
              )
            );
          } else {
            setSteps(Steps.SUCCESS);
          }
        },
      }
    );
  };
  return (
    <div className="pw-w-screen pw-min-h-screen pw-bg-[#EFEFEF]">
      <div className="pw-w-full pw-pt-32 pw-px-5">
        <Box className="pw-mx-auto">
          {isLoading ? <Spinner className="pw-mx-auto" /> : renderInternal()}
        </Box>
      </div>
    </div>
  );
};

export const LinkAccountTemplate = () => {
  const { isAuthorized, isLoading } = usePrivateRoute();
  useHasWallet({});
  if (!isAuthorized || isLoading) {
    return null;
  }
  return (
    <TranslatableComponent>
      <_LinkAccountTemplate />
    </TranslatableComponent>
  );
};
