import { lazy, useEffect } from 'react';

import useGetProductById from '../../../storefront/hooks/useGetProductById/useGetProductById';
import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { useRouterConnect } from '../../hooks';
import { useSessionUser } from '../../hooks/useSessionUser';
const Box = lazy(() =>
  import('../Box/Box').then((module) => ({
    default: module.Box,
  }))
);
const Spinner = lazy(() =>
  import('../Spinner').then((module) => ({
    default: module.Spinner,
  }))
);

import TranslatableComponent from '../TranslatableComponent';

const _RedirectTemplate = () => {
  const router = useRouterConnect();
  const user = useSessionUser();
  const productId = (router.query.productId as string) ?? '';
  const purchaseRequiredModalContent =
    (router.query.purchaseRequiredModalContent as string) ?? '';
  const { data: product } = useGetProductById(productId);

  useEffect(() => {
    if (!user) {
      router.pushConnect(PixwayAppRoutes.SIGN_IN, {
        callbackPath: window.location.href,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="pw-h-[80vh]">
      <div className="pw-flex pw-justify-center pw-items-center pw-flex-col pw-h-full">
        {user ? (
          <Box className="pw-mx-auto">
            <div
              className="pw-text-black pw-font-medium pw-text-xl"
              dangerouslySetInnerHTML={{
                __html: purchaseRequiredModalContent,
              }}
            ></div>
            <div className="pw-mt-4 pw-flex pw-flex-row pw-gap-3 pw-justify-around pw-items-center">
              <button
                onClick={() => window.close()}
                className="pw-px-[24px] pw-h-[33px] pw-bg-[#EFEFEF] pw-border-[#295BA6] pw-rounded-[48px] pw-border pw-font-poppins pw-font-medium pw-text-xs"
              >
                Fechar
              </button>
              {purchaseRequiredModalContent !== '' && productId !== '' ? (
                <button
                  onClick={() =>
                    router.pushConnect(
                      PixwayAppRoutes.PRODUCT_PAGE.replace(
                        '{slug}',
                        product?.slug ?? ''
                      )
                    )
                  }
                  className="pw-px-[24px] pw-h-[33px] pw-bg-[#0050FF] pw-text-white pw-border-[#0050FF] pw-rounded-[48px] pw-border pw-font-poppins pw-font-medium pw-text-xs"
                >
                  Continuar
                </button>
              ) : null}
            </div>
          </Box>
        ) : (
          <>
            <h1 className="pw-font-bold pw-text-3xl pw-text-black pw-mb-5">
              Redirecionando
            </h1>
            <Spinner className="!pw-h-20 !pw-w-20" />
          </>
        )}
      </div>
    </div>
  );
};

export const RedirectTemplate = () => {
  return (
    <TranslatableComponent>
      <_RedirectTemplate />
    </TranslatableComponent>
  );
};
