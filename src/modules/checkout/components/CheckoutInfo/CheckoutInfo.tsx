import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalStorage, useTimeoutFn } from 'react-use';

import { PriceAndGasInfo, ProductInfo } from '../../../shared';
import { PixwayButton } from '../../../shared/components/PixwayButton';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { WeblockButton } from '../../../shared/components/WeblockButton/WeblockButton';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { usePixwaySession } from '../../../shared/hooks/usePixwaySession';
import { useQuery } from '../../../shared/hooks/useQuery';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import { isValidCNPJ, isValidCPF } from '../../../shared/utils/validators';
import { PRODUCT_CART_INFO_KEY } from '../../config/keys/localStorageKey';
import { useCheckout } from '../../hooks/useCheckout';
import {
  OrderPreviewCache,
  OrderPreviewResponse,
  PaymentMethodsAvaiable,
} from '../../interface/interface';
import CpfCnpj from '../CpfCnpjInput/CpfCnpjInput';

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

const _CheckoutInfo = ({
  checkoutStatus = CheckoutStatus.FINISHED,
  returnAction,
  proccedAction,
  productId,
  currencyId,
}: CheckoutInfoProps) => {
  const router = useRouterConnect();
  const [requestError, setRequestError] = useState(false);
  const [cpfError, setCpfError] = useState(false);
  const { getOrderPreview } = useCheckout();
  const [translate] = useTranslation();
  const [productCache, setProductCache, deleteKey] =
    useLocalStorage<OrderPreviewCache>(PRODUCT_CART_INFO_KEY);
  const [choosedPayment, setChoosedPayment] = useState<
    PaymentMethodsAvaiable | undefined
  >();
  const [cnpfCpfVal, setCnpjCpfVal] = useState('');
  const query = useQuery();
  const [productIds, setProductIds] = useState<string[] | undefined>(productId);
  const [currencyIdState, setCurrencyIdState] = useState<string | undefined>(
    currencyId
  );
  const [orderPreview, setOrderPreview] = useState<OrderPreviewResponse | null>(
    null
  );
  const { companyId } = useCompanyConfig();

  const { data: session } = usePixwaySession();

  const token = session ? (session.accessToken as string) : null;

  useEffect(() => {
    if (checkoutStatus == CheckoutStatus.CONFIRMATION) {
      deleteKey();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.localStorage]);

  useEffect(() => {
    if (
      !productIds &&
      !currencyIdState &&
      checkoutStatus === CheckoutStatus.CONFIRMATION
    ) {
      const params = new URLSearchParams(query);
      const productIdsFromQueries = params.get('productIds');
      const currencyIdFromQueries = params.get('currencyId');
      if (productIdsFromQueries) {
        setProductIds(productIdsFromQueries.split(','));
      }
      if (currencyIdFromQueries) {
        setCurrencyIdState(currencyIdFromQueries);
      }
    } else {
      const preview = productCache;
      if (preview) {
        setOrderPreview({
          products: [preview.product],
          totalPrice: preview.totalPrice,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const getOrderPreviewFn = () => {
    if (
      productIds &&
      currencyIdState &&
      token &&
      checkoutStatus === CheckoutStatus.CONFIRMATION
    ) {
      getOrderPreview.mutate(
        {
          productIds,
          currencyId: currencyIdState,
          companyId,
        },
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSuccess: (data: OrderPreviewResponse) => {
            if (data && data.providersForSelection?.length) {
              setChoosedPayment(data.providersForSelection[0]);
            }
            setOrderPreview(data);
          },
          onError: () => {
            setRequestError(true);
          },
        }
      );
    }
  };

  useEffect(() => {
    getOrderPreviewFn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productIds, currencyIdState, token]);

  useTimeoutFn(() => {
    getOrderPreviewFn();
  }, 30000);

  const isLoading = orderPreview == null;

  const beforeProcced = () => {
    if (
      choosedPayment?.paymentMethod == 'pix' &&
      !isValidCPF(cnpfCpfVal) &&
      !isValidCNPJ(cnpfCpfVal)
    ) {
      setCpfError(true);
      return;
    }
    if (checkoutStatus == CheckoutStatus.CONFIRMATION && orderPreview) {
      const orderProducts = orderPreview.products?.map((pID) => {
        return {
          productId: pID.id,
          expectedPrice: pID.prices[0].amount,
        };
      });
      setProductCache({
        product: orderPreview.products[0],
        orderProducts,
        currencyId: currencyIdState || '',
        signedGasFee: orderPreview?.gasFee?.signature || '',
        totalPrice: orderPreview?.totalPrice ?? '',
        choosedPayment: choosedPayment,
        cpfCnpj: cnpfCpfVal,
      });
    }
    if (proccedAction) {
      proccedAction(query);
    } else {
      router.pushConnect(PixwayAppRoutes.CHECKOUT_PAYMENT + '?' + query);
    }
  };

  const _ButtonsToShow = () => {
    switch (checkoutStatus) {
      case CheckoutStatus.CONFIRMATION:
        return (
          <>
            <PriceAndGasInfo
              currency={orderPreview?.products[0]?.prices[0]?.currency?.name}
              totalPrice={orderPreview?.totalPrice || '0'}
              service={orderPreview?.clientServiceFee || '0'}
              loading={isLoading}
              className="pw-mt-4"
              price={
                parseFloat(orderPreview?.cartPrice || '0').toFixed(2) || '0'
              }
              gasFee={
                parseFloat(orderPreview?.gasFee?.amount || '0').toFixed(2) ||
                '0'
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
                className="!pw-py-3 !pw-px-[42px] !pw-bg-[#EFEFEF] !pw-text-xs !pw-text-[#383857] pw-border pw-border-[#DCDCDC] !pw-rounded-full hover:pw-bg-[#EFEFEF] hover:pw-shadow-xl disabled:pw-bg-[#A5A5A5] disabled:pw-text-[#373737] active:pw-bg-[#EFEFEF]"
              >
                {translate('shared>cancel')}
              </PixwayButton>
              <PixwayButton
                disabled={!orderPreview}
                onClick={beforeProcced}
                className="!pw-py-3 !pw-px-[42px] !pw-bg-[#295BA6] !pw-text-xs !pw-text-[#FFFFFF] pw-border pw-border-[#295BA6] !pw-rounded-full hover:pw-bg-[#295BA6] hover:pw-shadow-xl disabled:pw-bg-[#A5A5A5] disabled:pw-text-[#373737] active:pw-bg-[#EFEFEF]"
              >
                {translate('shared>continue')}
              </PixwayButton>
            </div>
          </>
        );
      case CheckoutStatus.FINISHED:
        return (
          <div className="pw-mt-4">
            <p className="pw-text-xs pw-text-[#353945] ">
              {translate(
                'checkout>components>checkoutInfo>infoAboutProcessing'
              )}
            </p>
            <PixwayButton
              onClick={
                returnAction
                  ? () => returnAction(query)
                  : () => {
                      router.pushConnect(PixwayAppRoutes.MY_TOKENS);
                    }
              }
              className="pw-mt-4 !pw-py-3 !pw-px-[42px] !pw-bg-[#295BA6] !pw-text-xs !pw-text-[#FFFFFF] pw-border pw-border-[#295BA6] !pw-rounded-full hover:pw-bg-[#295BA6] hover:pw-shadow-xl disabled:pw-bg-[#A5A5A5] disabled:pw-text-[#373737] active:pw-bg-[#EFEFEF]"
            >
              {translate('tokens>tokenTransferController>goToMyTokens')}
            </PixwayButton>
          </div>
        );
    }
  };

  return requestError ? (
    <div className="pw-container pw-mx-auto pw-pt-10 sm:pw-pt-15">
      <div className="pw-max-w-[600px] pw-flex pw-flex-col pw-justify-center pw-items-center">
        <p className="pw-font-bold pw-text-black pw-text-center pw-px-4">
          Houve um erro de comunicação com o servidor, entre em contato com
          nosso suporte.
        </p>
        <WeblockButton
          className="pw-text-white pw-mt-6"
          onClick={() => router.pushConnect(PixwayAppRoutes.HOME)}
        >
          Voltar para a home
        </WeblockButton>
      </div>
    </div>
  ) : (
    <div className="pw-flex">
      {orderPreview?.providersForSelection?.length && (
        <div className="pw-order-2 sm:pw-order-1 pw-w-full sm:pw-w-auto">
          <p className="pw-text-[18px] pw-w-[200px] pw-font-[700]">
            Forma de pagamento
          </p>
          {orderPreview.providersForSelection?.map((prov) => {
            return (
              <WeblockButton
                onClick={() => setChoosedPayment(prov)}
                tailwindBgColor={`${
                  prov.paymentMethod == choosedPayment?.paymentMethod
                    ? 'pw-bg-brand-primary'
                    : 'pw-bg-slate-300'
                } `}
                className={`pw-cursor-pointer pw-mt-4 hover:pw-bg-[#295BA6] pw-w-full ${
                  prov.paymentMethod == choosedPayment?.paymentMethod
                    ? 'pw-text-white'
                    : 'pw-text-[#777E8F]'
                }`}
                key={prov.paymentMethod}
              >
                {prov.paymentMethod == 'credit_card'
                  ? 'Cartão de Crédito'
                  : 'PIX'}
              </WeblockButton>
            );
          })}
        </div>
      )}

      <div className="pw-w-full xl:pw-max-w-[80%] lg:pw-px-[60px] pw-px-6 pw-order-1 sm:pw-order-2">
        {choosedPayment?.paymentMethod == 'pix' && (
          <>
            <p className="pw-text-[18px] pw-font-[700]">
              Por favor, digite seu CPF ou CNPJ
            </p>
            <CpfCnpj
              maxLength={18}
              onChange={(e: any) => {
                setCpfError(false);
                setCnpjCpfVal(e.target.value);
              }}
              placeholder="Somente números"
              className="pw-mt-4 pw-border pw-border-brand-primary pw-rounded-lg pw-w-full pw-p-[10px] focus-visible:pw-outline-none "
            />

            <p className="pw-mt-1 pw-text-sm pw-text-red-500 pw-mb-4">
              {cpfError ? 'CPF ou CNPJ inválido' : ''}
            </p>
          </>
        )}

        <p className="pw-text-[18px] pw-font-[700]">Resumo da compra</p>
        {checkoutStatus == CheckoutStatus.FINISHED && (
          <p className="pw-font-[700] pw-text-2xl">
            {translate(
              'checkout>components>checkoutInfo>proccessingBlockchain'
            )}
          </p>
        )}
        <ProductInfo
          currency={orderPreview?.products[0]?.prices[0]?.currency?.name}
          loading={isLoading}
          status={checkoutStatus}
          className="pw-mt-3"
          image={orderPreview?.products[0]?.images[0]?.thumb || ''}
          id={orderPreview?.products[0]?.contractAddress || ''}
          name={orderPreview?.products[0]?.name || ''}
          price={
            checkoutStatus == CheckoutStatus.FINISHED
              ? parseFloat(orderPreview?.totalPrice ?? '0').toFixed(2)
              : parseFloat(
                  orderPreview?.products[0]?.prices[0].amount || '0'
                ).toFixed(2) || ''
          }
        />
        <_ButtonsToShow />
      </div>
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
