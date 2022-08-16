import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PriceAndGasInfo, ProductInfo } from '../../../shared';
import { ReactComponent as CreditCardIcon } from '../../../shared/assets/icons/creditCard.svg';
import { PixwayButton } from '../../../shared/components/PixwayButton';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyId } from '../../../shared/hooks/useCompanyId';
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage/useLocalStorage';
import { usePixwayAPIURL } from '../../../shared/hooks/usePixwayAPIURL/usePixwayAPIURL';
import { useQuery } from '../../../shared/hooks/useQuery';
import useRouter from '../../../shared/hooks/useRouter';
import { getOrderPreview } from '../../api/orderPreview';
import { OrderPreviewResponse } from '../../api/orderPreview/interface';
import { PRODUCT_CART_INFO_KEY } from '../../config/keys/localStorageKey';

export enum CheckoutStatus {
  CONFIRMATION = 'CONFIRMATION',
  FINISHED = 'FINISHED',
}

interface CheckoutInfoProps {
  checkoutStatus?: CheckoutStatus;
  returnAction?: (query: string) => void;
  proccedAction?: (query: string) => void;
  productId?: string[];
  currencyId?: string;
}

const token =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiODkxOWI2Yy1mMTQ2LTRkODQtODg2ZS04OGZlY2E0YzM3ZTkiLCJpc3MiOiJlOGE5ODE0ZS0xOGExLTRmNTItYjZjYS1jMTVmMGFlMjI5NGEiLCJhdWQiOiJlOGE5ODE0ZS0xOGExLTRmNTItYjZjYS1jMTVmMGFlMjI5NGEiLCJlbWFpbCI6InBpeHdheUB3M2Jsb2NrLmlvIiwibmFtZSI6IlBpeHdheSIsInJvbGVzIjpbInVzZXIiXSwiY29tcGFueUlkIjoiZThhOTgxNGUtMThhMS00ZjUyLWI2Y2EtYzE1ZjBhZTIyOTRhIiwidGVuYW50SWQiOiJlOGE5ODE0ZS0xOGExLTRmNTItYjZjYS1jMTVmMGFlMjI5NGEiLCJ2ZXJpZmllZCI6dHJ1ZSwidHlwZSI6InVzZXIiLCJpYXQiOjE2NjAzMjgxMjAsImV4cCI6MTY2MDkzMjkyMH0.fbHIOVrgwRI_zS8W-bsaYGV5vpXS4orQJToXBZsBl1Gr6sm6i_FDI6DOq5TB_3sDjzyvwhB2JBvmW_32Qv9MmbYtFXukxPf8ZEKn3qAigOsmnc-icAe66Rb6eDns6C0tsNcbt_zWVz3ntAq1BUyaFSiqhdyPCrK4cjarQ6Q-I3k';

const _CheckoutInfo = ({
  checkoutStatus = CheckoutStatus.FINISHED,
  returnAction,
  proccedAction,
  productId,
  currencyId,
}: CheckoutInfoProps) => {
  const router = useRouter();
  const [translate] = useTranslation();
  const { deleteKey, setStorage } = useLocalStorage();
  const query = useQuery();
  const [productIds, setProductIds] = useState<string[] | undefined>(productId);
  const [currencyIdState, setCurrencyIdState] = useState<string | undefined>(
    currencyId
  );
  const [orderPreview, setOrderPreview] = useState<OrderPreviewResponse | null>(
    null
  );
  const companyId = useCompanyId();
  const baseUrl = usePixwayAPIURL();

  useEffect(() => {
    deleteKey(PRODUCT_CART_INFO_KEY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.localStorage]);

  useEffect(() => {
    if (!productIds && !currencyIdState) {
      const params = new URLSearchParams(query);
      const productIdsFromQueries = params.get('productIds');
      const currencyIdFromQueries = params.get('currencyId');
      if (productIdsFromQueries) {
        setProductIds(productIdsFromQueries.split(','));
      }
      if (currencyIdFromQueries) {
        setCurrencyIdState(currencyIdFromQueries);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    if (productIds && currencyIdState) {
      getOrderPreview({
        productIds,
        currencyId: currencyIdState,
        companyId,
        baseUrl,
        token,
      }).then((res) => setOrderPreview(res));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productIds, currencyIdState]);

  const isLoading = useMemo(() => {
    return orderPreview == null;
  }, [orderPreview]);

  const UnderCreditText = useMemo(() => {
    switch (checkoutStatus) {
      case CheckoutStatus.CONFIRMATION:
        return 'Você será redirecionado para o nosso parceiro Pagar.me';
      case CheckoutStatus.FINISHED:
        return 'Estamos processando na blockchain, isso pode demorar alguns minutos!';
    }
  }, [checkoutStatus]);

  const beforeProcced = () => {
    if (checkoutStatus == CheckoutStatus.CONFIRMATION && orderPreview) {
      const orderProducts = orderPreview.products?.map((pID) => {
        return {
          productId: pID.id,
          expectedPrice: pID.prices[0].amount,
        };
      });
      setStorage(PRODUCT_CART_INFO_KEY, {
        orderProducts,
        currencyId: currencyIdState,
        //destinationWalletAddress: '0xd3304183ec1fa687e380b67419875f97f1db05f5',
        signedGasFee: orderPreview.gasFee.signature,
      });
    }
    if (proccedAction) {
      proccedAction(query);
    } else {
      router.push(PixwayAppRoutes.CHECKOUT_PAYMENT + query);
    }
  };

  const _ButtonsToShow = useMemo(() => {
    switch (checkoutStatus) {
      case CheckoutStatus.CONFIRMATION:
        return (
          <>
            <PriceAndGasInfo
              totalPrice={orderPreview?.totalPrice || '0'}
              service={orderPreview?.serviceFee || '0'}
              loading={isLoading}
              className="pw-mt-4"
              price={
                parseFloat(orderPreview?.cartPrice || '0').toFixed(2) || '0'
              }
              gasFee={
                parseFloat(orderPreview?.gasFee.amount || '0').toFixed(2) || '0'
              }
            />
            <div className="pw-flex pw-mt-4 pw-gap-x-4">
              <PixwayButton
                onClick={
                  returnAction
                    ? () => returnAction(query)
                    : () => {
                        router.push(PixwayAppRoutes.HOME);
                      }
                }
                className="!pw-py-3 !pw-px-[42px] !pw-bg-[#EFEFEF] !pw-text-xs pw-text-[#383857] pw-border pw-border-[#DCDCDC] !pw-rounded-full hover:pw-bg-[#EFEFEF] hover:pw-shadow-xl disabled:pw-bg-[#A5A5A5] disabled:pw-text-[#373737] active:pw-bg-[#EFEFEF]"
              >
                Cancelar
              </PixwayButton>
              <PixwayButton
                disabled={!orderPreview}
                onClick={beforeProcced}
                className="!pw-py-3 !pw-px-[42px] !pw-bg-[#295BA6] !pw-text-xs !pw-text-[#FFFFFF] pw-border pw-border-[#295BA6] !pw-rounded-full hover:pw-bg-[#295BA6] hover:pw-shadow-xl disabled:pw-bg-[#A5A5A5] disabled:pw-text-[#373737] active:pw-bg-[#EFEFEF]"
              >
                Continuar
              </PixwayButton>
            </div>
          </>
        );
      case CheckoutStatus.FINISHED:
        return (
          <div className="pw-mt-4">
            <p className="pw-text-xs pw-text-[#353945] ">
              disponíveis na sua carteira. O tempo de processamento pode variar
              de poucos minutos até 4 horas de acordo com o tráfego da rede
              blockchain. Nós te avisaremos assim que o processamento estiver
              finalizado.
            </p>
            <PixwayButton
              onClick={
                returnAction
                  ? () => returnAction(query)
                  : () => {
                      router.push(PixwayAppRoutes.HOME);
                    }
              }
              className="pw-mt-4 !pw-py-3 !pw-px-[42px] !pw-bg-[#295BA6] !pw-text-xs !pw-text-[#FFFFFF] pw-border pw-border-[#295BA6] !pw-rounded-full hover:pw-bg-[#295BA6] hover:pw-shadow-xl disabled:pw-bg-[#A5A5A5] disabled:pw-text-[#373737] active:pw-bg-[#EFEFEF]"
            >
              Sair
            </PixwayButton>
          </div>
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutStatus, orderPreview]);

  return (
    <div className="pw-w-full xl:pw-max-w-[80%] lg:pw-px-[80px] pw-px-6">
      <p className="pw-text-[18px] pw-font-[700]">Checkout</p>
      <div className="pw-flex pw-mt-3 pw-items-center pw-gap-x-2">
        <CreditCardIcon />
        <p className=" pw-font-[700] pw-text-lg pw-text-[#35394C]">
          {translate('checkout>components>checkoutInfo>payment')}
        </p>
      </div>
      <p className="pw-font-[700] pw-text-2xl">
        {translate('checkout>components>checkoutInfo>creditCard')}
      </p>
      <p className="pw-font-[600] pw-text-[#35394C] pw-text-[15px] pw-mt-3">
        {UnderCreditText}
      </p>
      <p className="pw-font-[700] pw-text-lg pw-mt-4">
        {translate('shared>product')}
      </p>
      <ProductInfo
        loading={isLoading}
        status={checkoutStatus}
        className="pw-mt-3"
        image={orderPreview?.products[0]?.images[0]?.thumb || ''}
        id={orderPreview?.products[0]?.contractAddress || ''}
        name={orderPreview?.products[0]?.name || ''}
        price={
          parseFloat(
            orderPreview?.products[0]?.prices[0].amount || '0'
          ).toFixed(2) || ''
        }
      />
      {_ButtonsToShow}
    </div>
  );
};

export const CheckoutInfo = ({
  checkoutStatus,
  returnAction,
  proccedAction,
  productId,
  currencyId,
}: CheckoutInfoProps) => {
  return (
    <TranslatableComponent>
      <_CheckoutInfo
        proccedAction={proccedAction}
        returnAction={returnAction}
        checkoutStatus={checkoutStatus}
        productId={productId}
        currencyId={currencyId}
      />
    </TranslatableComponent>
  );
};
