import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInterval, useLocalStorage } from 'react-use';

import { PriceAndGasInfo, Product, ProductInfo } from '../../../shared';
import { ModalBase } from '../../../shared/components/ModalBase';
import { PixwayButton } from '../../../shared/components/PixwayButton';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { WeblockButton } from '../../../shared/components/WeblockButton/WeblockButton';
import { CurrencyEnum } from '../../../shared/enums/Currency';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useModalController } from '../../../shared/hooks/useModalController';
import { usePixwaySession } from '../../../shared/hooks/usePixwaySession';
import { useQuery } from '../../../shared/hooks/useQuery';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import { isValidCNPJ, isValidCPF } from '../../../shared/utils/validators';
import { PRODUCT_CART_INFO_KEY } from '../../config/keys/localStorageKey';
import { useCart } from '../../hooks/useCart';
import { useCheckout } from '../../hooks/useCheckout';
import {
  OrderPreviewCache,
  OrderPreviewResponse,
  PaymentMethodsAvaiable,
} from '../../interface/interface';
import { ConfirmCryptoBuy } from '../ConfirmCryptoBuy/ConfirmCryptoBuy';
import CpfCnpj from '../CpfCnpjInput/CpfCnpjInput';

export enum CheckoutStatus {
  CONFIRMATION = 'CONFIRMATION',
  FINISHED = 'FINISHED',
  MY_ORDER = 'MY_ORDER',
}

interface CheckoutInfoProps {
  checkoutStatus?: CheckoutStatus;
  returnAction?: (query: string) => void;
  proccedAction?: (query: string) => void;
  productId?: string[];
  currencyId?: string;
  isCart?: boolean;
}

const _CheckoutInfo = ({
  checkoutStatus = CheckoutStatus.FINISHED,
  returnAction,
  proccedAction,
  productId,
  currencyId,
  isCart = false,
}: CheckoutInfoProps) => {
  const router = useRouterConnect();
  const { isOpen, openModal, closeModal } = useModalController();
  const [requestError, setRequestError] = useState(false);
  const [cpfError, setCpfError] = useState(false);
  const { getOrderPreview } = useCheckout();
  const [translate] = useTranslation();
  const { setCart, cart } = useCart();
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
          products: [...preview.products],
          totalPrice: preview.totalPrice,
          clientServiceFee: preview.clientServiceFee,
          gasFee: { amount: preview.gasFee ?? '0', signature: '' },
          cartPrice: preview.cartPrice,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    const params = new URLSearchParams(query);
    const currencyIdFromQueries = params.get('currencyId');
    if (currencyIdFromQueries) {
      setCurrencyIdState(currencyIdFromQueries);
    }
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

  useInterval(() => {
    getOrderPreviewFn();
  }, 30000);

  const isLoading = orderPreview == null;

  const beforeProcced = () => {
    if (
      choosedPayment?.paymentMethod == 'pix' &&
      !isValidCPF(cnpfCpfVal.replaceAll('.', '').replaceAll('-', '')) &&
      !isValidCNPJ(
        cnpfCpfVal.replaceAll('.', '').replaceAll('-', '').replaceAll('/', '')
      )
    ) {
      setCpfError(true);
      return;
    }
    if (checkoutStatus == CheckoutStatus.CONFIRMATION && orderPreview) {
      const orderProducts = orderPreview.products?.map((pID) => {
        return {
          productId: pID.id,
          expectedPrice:
            pID.prices.find((price) => price.currencyId == currencyIdState)
              ?.amount ?? '0',
        };
      });
      setProductCache({
        products: orderPreview.products,
        orderProducts,
        currencyId: currencyIdState || '',
        signedGasFee: orderPreview?.gasFee?.signature || '',
        totalPrice: orderPreview?.totalPrice ?? '',
        clientServiceFee: orderPreview?.clientServiceFee || '0',
        gasFee:
          parseFloat(orderPreview?.gasFee?.amount || '0').toFixed(2) || '0',
        cartPrice: parseFloat(orderPreview?.cartPrice || '0').toFixed(2) || '0',
        choosedPayment: choosedPayment,
        cpfCnpj: cnpfCpfVal,
      });
    }
    if (proccedAction) {
      proccedAction(query);
    } else {
      if (
        orderPreview?.products[0].prices.find(
          (price) => price.currencyId == currencyIdState
        )?.currency.crypto
      ) {
        openModal();
        return;
      } else {
        router.pushConnect(
          PixwayAppRoutes.CHECKOUT_PAYMENT +
            '?' +
            query +
            (isCart ? '&cart=true' : '')
        );
      }
    }
  };

  const changeQuantity = (n: number, id: string) => {
    let newArray: Array<string> = [];
    if (
      productIds &&
      productIds?.filter((filteredId) => filteredId == id).length < n
    ) {
      newArray = [...productIds, id];
    } else {
      productIds?.forEach((idProd) => {
        if (
          id != idProd ||
          newArray.filter((idNew) => idNew == idProd).length < n
        ) {
          newArray.push(idProd);
        }
      });
    }
    router.push(PixwayAppRoutes.CHECKOUT_CONFIRMATION, {
      query: {
        productIds: newArray.join(','),
        currencyId: orderPreview?.products[0].prices.find(
          (price) => price.currencyId == currencyIdState
        )?.currencyId,
      },
    });
    if (isCart) {
      const newCart = newArray.map((id) =>
        cart.find((prodCart) => prodCart.id == id)
      );

      setCart(newCart);
    }

    setProductIds(newArray);
  };

  const deleteProduct = (id: string) => {
    router.push(
      isCart
        ? PixwayAppRoutes.CHECKOUT_CART_CONFIRMATION
        : PixwayAppRoutes.CHECKOUT_CONFIRMATION,
      {
        query: {
          productIds: productIds?.filter((p) => p != id).join(','),
          currencyId: orderPreview?.products[0].prices.find(
            (price) => price.currencyId == currencyIdState
          )?.currencyId,
        },
      }
    );
    if (isCart) {
      setCart(cart.filter((prod) => prod.id != id));
    }

    setProductIds(productIds?.filter((p) => p != id));
  };

  const differentProducts = useMemo<Array<Product>>(() => {
    if (orderPreview && orderPreview.products.length) {
      const uniqueProduct: Product[] = [];
      orderPreview.products.forEach((p) => {
        if (!uniqueProduct.some((prod) => p.id == prod.id)) {
          uniqueProduct.push(p);
        }
      });
      return uniqueProduct;
    } else {
      return [];
    }
  }, [orderPreview]);

  const _ButtonsToShow = useMemo(() => {
    switch (checkoutStatus) {
      case CheckoutStatus.CONFIRMATION:
        return (
          <>
            <PriceAndGasInfo
              currency={
                orderPreview?.products[0].prices.find(
                  (price) => price.currency.id == currencyIdState
                )?.currency.symbol
              }
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
            <PriceAndGasInfo
              currency={
                productCache?.products[0].prices.find(
                  (price) =>
                    price.currencyId == (router.query.currencyId as string)
                )?.currency.symbol
              }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderPreview, cnpfCpfVal, choosedPayment, currencyIdState]);

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
    <>
      <div className="pw-flex pw-flex-col sm:pw-flex-row">
        {orderPreview?.providersForSelection?.length && (
          <div className=" pw-w-full sm:pw-w-auto">
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

        <div className="pw-w-full xl:pw-max-w-[80%] lg:pw-px-[60px] pw-px-6 pw-mt-6 sm:pw-mt-0">
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

          <p className="pw-text-[18px] pw-font-[700] pw-text-[#35394C]">
            Resumo da compra
          </p>
          {checkoutStatus == CheckoutStatus.FINISHED && (
            <p className="pw-font-[700] pw-text-2xl pw-mb-6 pw-mt-2">
              {translate(
                'checkout>components>checkoutInfo>proccessingBlockchain'
              )}
            </p>
          )}
          <div className="pw-border pw-bg-white pw-border-[rgba(0,0,0,0.2)] pw-rounded-2xl pw-overflow-hidden">
            {differentProducts.map((prod) => (
              <ProductInfo
                isCart={isCart}
                className="pw-border-b pw-border-[rgba(0,0,0,0.1)] "
                currency={
                  prod.prices.find(
                    (prodI) => prodI.currencyId == currencyIdState
                  )?.currency.symbol
                }
                quantity={
                  productIds
                    ? productIds?.filter((p) => p == prod.id).length
                    : 1
                }
                stockAmount={prod.stockAmount}
                canPurchaseAmount={prod.canPurchaseAmount}
                changeQuantity={changeQuantity}
                loading={isLoading}
                status={checkoutStatus}
                deleteProduct={deleteProduct}
                id={prod.id}
                key={prod.id}
                image={prod.images[0].thumb}
                name={prod.name}
                price={parseFloat(
                  prod.prices.find(
                    (price) => price.currencyId == currencyIdState
                  )?.amount ?? '0'
                ).toFixed(2)}
              />
            ))}
          </div>
          {_ButtonsToShow}
        </div>
      </div>
      <ModalBase
        classes={{ dialogCard: 'pw-min-w-[400px] pw-max-w-[450px]' }}
        onClose={closeModal}
        isOpen={isOpen}
      >
        <ConfirmCryptoBuy
          orderInfo={productCache}
          onClose={closeModal}
          totalPrice={orderPreview?.totalPrice ?? '0'}
          gasPrice={orderPreview?.gasFee?.amount ?? '0'}
          serviceFee={orderPreview?.clientServiceFee ?? ''}
          code={
            orderPreview?.products[0].prices.find(
              (price) => price.currencyId == currencyIdState
            )?.currency.code as CurrencyEnum
          }
        />
      </ModalBase>
    </>
  );
};

export const CheckoutInfo = ({
  checkoutStatus,
  returnAction,
  proccedAction,
  productId,
  currencyId,
  isCart,
}: CheckoutInfoProps) => {
  return (
    <TranslatableComponent>
      <_CheckoutInfo
        proccedAction={proccedAction}
        returnAction={returnAction}
        checkoutStatus={checkoutStatus}
        productId={productId}
        currencyId={currencyId}
        isCart={isCart}
      />
    </TranslatableComponent>
  );
};
