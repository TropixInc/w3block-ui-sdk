"use client";

import { CurrencyInput } from 'react-currency-mask';
import { ReactNode } from 'react';

import { Alert } from '../../../shared/components/Alert';
import { BaseSelect } from '../../../shared/components/BaseSelect';
import { PixwayButton } from '../../../shared/components/PixwayButton';
import { PriceAndGasInfo } from '../../../shared/components/PriceAndGasInfo';
import { Shimmer } from '../../../shared/components/Shimmer';
import { CurrencyResponse } from '../../../storefront/interfaces/Product';
import { PaymentMethodsAvaiable } from '../../interface/interface';
import { OrderPreviewResponse } from '../../interface/interface';
import { WalletWithBalance } from '../../utils/checkoutHelpers';
import CoinPaymentResume from '../CoinPaymentResume';
import { CouponSection } from './CouponSection';
import { LoyaltyBalanceDisplay } from './LoyaltyBalanceDisplay';
import { PaymentMethodsComponent } from '../PaymentMethodsComponent';
import { Selector } from '../../../storefront/components/Selector';

export interface CheckoutConfirmationContentProps {
  orderPreview: OrderPreviewResponse | null;
  currencyIdState: string | undefined;
  isCoinPayment: boolean;
  isErc20: boolean;
  isLoading: boolean;
  isLoadingPreview: boolean;
  paymentAmount: string;
  setPaymentAmount: (v: string) => void;
  batchSize?: string;
  Erc20Input: ReactNode;
  acceptMultipleCurrenciesPurchase: boolean;
  hideCoupon: boolean | undefined;
  couponCodeInput: string | undefined;
  appliedCoupon: string | null | undefined;
  onSubmitCupom: () => void;
  translate: (key: string, obj?: any) => string;
  isCart: boolean;
  hasCommonCurrencies: boolean;
  commonCurrencies: CurrencyResponse[];
  currVal: string | undefined;
  setCurrVal: (v: string | undefined) => void;
  setCurrencyIdState: (v: string | undefined) => void;
  setCartCurrencyId: ((c: CurrencyResponse | undefined) => void) | undefined;
  choosedPayment: PaymentMethodsAvaiable | undefined;
  setChoosedPayment: (p: PaymentMethodsAvaiable) => void;
  automaxLoyalty: boolean | undefined;
  organizedLoyalties: WalletWithBalance[] | undefined;
  coinAmountPayment: string;
  setCoinAmountPayment: (v: string) => void;
  paymentComplement: boolean;
  payWithCoin: () => boolean;
  coinError: string;
  returnAction?: (query: string) => void;
  query: string;
  onNavigateHome: () => void;
  beforeProcced: () => void;
  requestError: string;
  requestErrorCode: string;
  datasourceMasterData?: any[];
  destinationUser: string | undefined;
  editableDestination: boolean | undefined;
  onDestinationChange: (destinationId: string) => void;
}

export function CheckoutConfirmationContent({
  orderPreview,
  currencyIdState,
  isCoinPayment,
  isErc20,
  isLoading,
  isLoadingPreview,
  paymentAmount,
  setPaymentAmount,
  batchSize,
  Erc20Input,
  acceptMultipleCurrenciesPurchase,
  hideCoupon,
  couponCodeInput,
  appliedCoupon,
  onSubmitCupom,
  translate,
  isCart,
  hasCommonCurrencies,
  commonCurrencies,
  currVal,
  setCurrVal,
  setCurrencyIdState,
  setCartCurrencyId,
  choosedPayment,
  setChoosedPayment,
  automaxLoyalty,
  organizedLoyalties,
  coinAmountPayment,
  setCoinAmountPayment,
  paymentComplement,
  payWithCoin,
  coinError,
  returnAction,
  query,
  onNavigateHome,
  beforeProcced,
  requestError,
  requestErrorCode,
  datasourceMasterData,
  destinationUser,
  editableDestination,
  onDestinationChange,
}: CheckoutConfirmationContentProps) {
  const currencyName =
    orderPreview?.products?.[0]?.prices?.find(
      (p) => p?.currency?.id === currencyIdState
    )?.currency?.name ?? 'BRL';

  const paymentForCurrency = orderPreview?.payments?.filter(
    (e) => e.currencyId === currencyIdState
  )[0];
  const totalPriceForCurrency = parseFloat(
    paymentForCurrency?.totalPrice ?? '0'
  );
  const showPaymentMethods =
    totalPriceForCurrency !== 0 &&
    !(
      isCoinPayment &&
      (paymentAmount === '' || parseFloat(paymentAmount) === 0)
    );

  return (
    <>
      {!isCoinPayment && !isErc20 && (
        <PriceAndGasInfo
          payments={orderPreview?.payments}
          name={currencyName}
          loading={isLoading || isLoadingPreview}
          className="pw-mt-4"
        />
      )}
      {(isCoinPayment || isErc20) && (
        <>
          {datasourceMasterData && destinationUser && (
            <Selector
              disabled={!editableDestination}
              data={datasourceMasterData}
              title={translate('checkout>checkoutInfo>youPayFor')}
              initialValue={
                datasourceMasterData.filter(
                  (e: any) => e?.attributes?.slug === destinationUser
                )[0]?.id
              }
              onChange={onDestinationChange}
              classes={{
                title: '!pw-font-[400] pw-font-poppins',
                value: '!pw-font-[700] pw-font-poppins',
              }}
            />
          )}
          <p className="pw-font-[400] pw-text-base pw-text-[#35394C] pw-mt-5 pw-mb-2">
            {acceptMultipleCurrenciesPurchase
              ? null
              : isErc20 && !isCoinPayment
                ? translate('checkout>checkoutInfo>valueOfPay2') +
                  ' ' +
                  orderPreview?.products?.[0]?.name
                : translate('checkout>checkoutInfo>valueOfPay')}
          </p>
          <div className="pw-mb-8">
            {!acceptMultipleCurrenciesPurchase && (
              <div>
                <div className="pw-flex pw-gap-3">
                  <div>{Erc20Input}</div>
                  {batchSize && (
                    <div className="pw-flex pw-gap-2">
                      <button
                        onClick={() =>
                          setPaymentAmount(
                            (
                              parseFloat(paymentAmount) -
                              parseFloat(batchSize)
                            ).toString() + ',00'
                          )
                        }
                        className="pw-text-black pw-border pw-border-solid pw-font-bold pw-px-4 pw-rounded-lg pw-h-[42px]"
                        disabled={
                          parseFloat(paymentAmount) === 0 ||
                          parseFloat(paymentAmount) === parseFloat(batchSize)
                        }
                      >
                        -
                      </button>
                      <button
                        onClick={() =>
                          setPaymentAmount(
                            (
                              parseFloat(paymentAmount) +
                              parseFloat(batchSize)
                            ).toString() + ',00'
                          )
                        }
                        disabled={
                          orderPreview?.products?.[0]?.canPurchaseAmount
                            ? (parseFloat(paymentAmount) +
                                parseFloat(batchSize) >
                                orderPreview?.products?.[0]?.canPurchaseAmount &&
                                parseFloat(paymentAmount) +
                                  parseFloat(batchSize) >
                                  orderPreview?.products?.[0]?.stockAmount) ??
                              false
                            : false
                        }
                        className="pw-text-black pw-border pw-border-solid pw-font-bold pw-px-4 pw-rounded-lg pw-h-[42px]"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
                {orderPreview?.products?.[0]?.canPurchaseAmount &&
                  parseFloat(paymentAmount) + parseFloat(batchSize ?? '0') >
                    orderPreview?.products?.[0]?.canPurchaseAmount &&
                  parseFloat(paymentAmount) + parseFloat(batchSize ?? '0') >
                    orderPreview?.products?.[0]?.stockAmount && (
                    <p className="pw-text-[12px] pw-text-gray-500 pw-mt-1">
                      {translate('pages>product>reachStock', {
                        product: orderPreview?.products?.[0]?.name,
                      })}
                    </p>
                  )}
                {batchSize && (
                  <p className="pw-text-gray-500 pw-text-xs pw-mt-2">
                    {translate('pages>checkout>batchSize', { batchSize })}
                  </p>
                )}
              </div>
            )}
            {automaxLoyalty && (
              <LoyaltyBalanceDisplay
                organizedLoyalties={organizedLoyalties}
                translate={translate}
                showCurrencyInLabel
              />
            )}
          </div>
          {(paymentAmount === '' ||
            parseFloat(paymentAmount) === 0 ||
            !isCoinPayment) ? null : (
            <CoinPaymentResume
              payments={orderPreview?.payments}
              loading={isLoading || isLoadingPreview}
              currency={organizedLoyalties?.[0]?.currency}
            />
          )}
        </>
      )}
      {!hideCoupon && (
        <CouponSection
          couponCodeInput={couponCodeInput}
          appliedCoupon={appliedCoupon}
          onApply={onSubmitCupom}
          translate={translate}
        />
      )}
      {!isCoinPayment && isErc20 && (
        <PriceAndGasInfo
          isErc20
          payments={orderPreview?.payments}
          name={currencyName}
          loading={isLoading || isLoadingPreview}
          className="pw-my-4"
        />
      )}
      {isCart && hasCommonCurrencies && commonCurrencies.length > 1 && (
        <div className="pw-container pw-mx-auto pw-mb-8">
          <div className="pw-max-w-[600px] pw-flex pw-flex-col pw-justify-center pw-items-start">
            <p className="pw-font-bold pw-text-black pw-text-left pw-mb-4">
              {translate('checkout>currencyAnalyze>chooseCurrency')}
            </p>
            <form className="pw-flex pw-gap-4" action="submit">
              <BaseSelect
                options={commonCurrencies.map((res) => ({
                  value: res.id,
                  label: res.symbol,
                }))}
                value={currVal}
                onChangeValue={(e) => {
                  setCurrVal(e?.value);
                  setCurrencyIdState(e.value);
                  setCartCurrencyId?.(
                    commonCurrencies.find((res) => res.id === e.value)
                  );
                }}
              />
            </form>
          </div>
        </div>
      )}
      {showPaymentMethods && (
        <PaymentMethodsComponent
          loadingPreview={isLoadingPreview}
          methodSelected={choosedPayment ?? ({} as PaymentMethodsAvaiable)}
          methods={paymentForCurrency?.providersForSelection ?? []}
          onSelectedPayemnt={setChoosedPayment}
          title={
            isCoinPayment
              ? translate('checkout>checkoutInfo>howCompletePayment')
              : translate('checkout>checkoutInfo>paymentMethod')
          }
          titleClass={
            isCoinPayment ? '!pw-font-[400] pw-font-poppins !pw-text-base' : ''
          }
        />
      )}
      {isCoinPayment && (
        <>
          {!automaxLoyalty && (
            <>
              <p className="pw-font-[600] pw-text-sm pw-font-poppins pw-text-[#35394C] pw-mt-5 pw-mb-2">
                {organizedLoyalties?.[0]?.currency} ({' '}
                {translate('wallet>page>balance')}:{' '}
                <LoyaltyBalanceDisplay
                  organizedLoyalties={organizedLoyalties}
                  translate={translate}
                  showLabel={false}
                />
                )
              </p>
              <div className="pw-mb-8">
                <div className="pw-flex pw-gap-3">
                  <CurrencyInput
                    hideSymbol
                    onChangeValue={(_, value) =>
                      setCoinAmountPayment(value as string)
                    }
                    defaultValue={coinAmountPayment}
                    InputElement={
                      <input
                        disabled={
                          (paymentAmount === '' || !!automaxLoyalty) &&
                          !acceptMultipleCurrenciesPurchase
                        }
                        className="pw-p-2 pw-rounded-lg pw-border pw-border-[#DCDCDC] pw-shadow-md pw-text-black focus:pw-outline-none pw-font-poppins"
                        placeholder="0.00"
                      />
                    }
                  />
                </div>
              </div>
            </>
          )}
          {acceptMultipleCurrenciesPurchase && (
            <>
              <CoinPaymentResume
                payments={orderPreview?.payments}
                loading={isLoading || isLoadingPreview}
                currency={organizedLoyalties?.[0]?.currency}
              />
              {paymentComplement && (
                <PaymentMethodsComponent
                  loadingPreview={isLoadingPreview}
                  methodSelected={choosedPayment ?? ({} as PaymentMethodsAvaiable)}
                  methods={paymentForCurrency?.providersForSelection ?? []}
                  onSelectedPayemnt={setChoosedPayment}
                  title={
                    isCoinPayment
                      ? translate('checkout>checkoutInfo>howCompletePayment')
                      : translate('checkout>checkoutInfo>paymentMethod')
                  }
                  titleClass={
                    isCoinPayment
                      ? '!pw-font-[400] pw-font-poppins !pw-text-base'
                      : ''
                  }
                />
              )}
            </>
          )}
          {!payWithCoin() && (
            <Alert variant="atention" className="pw-mt-3">
              {coinError}
            </Alert>
          )}
          {paymentAmount !== '' && parseFloat(paymentAmount) !== 0 && (
            <Alert
              variant="success"
              className="!pw-text-black !pw-font-normal pw-mt-4 pw-font-poppins"
            >
              {translate('checkout>checkoutInfo>youWin')}{' '}
              <b className="pw-mx-[4px]">
                {isLoading || isLoadingPreview ? (
                  <Shimmer />
                ) : (
                  'R$' + orderPreview?.cashback?.cashbackAmount
                )}
              </b>{' '}
              {translate('checkout>checkoutInfo>inZucas')}
            </Alert>
          )}
        </>
      )}
      <div className="pw-flex pw-mt-4 pw-gap-x-4">
        <PixwayButton
          onClick={returnAction ? () => returnAction(query) : onNavigateHome}
          className="!pw-py-3 !pw-px-[42px] !pw-bg-[#EFEFEF] !pw-text-xs !pw-text-[#383857] pw-border pw-border-[#DCDCDC] !pw-rounded-full hover:pw-bg-[#EFEFEF] hover:pw-shadow-xl disabled:pw-bg-[#A5A5A5] disabled:pw-text-[#373737] active:pw-bg-[#EFEFEF]"
        >
          {translate('shared>cancel')}
        </PixwayButton>
        <PixwayButton
          disabled={
            !orderPreview ||
            isLoadingPreview ||
            !payWithCoin() ||
            (isCoinPayment &&
              (paymentAmount === '' || parseFloat(paymentAmount) === 0) &&
              !acceptMultipleCurrenciesPurchase)
          }
          onClick={beforeProcced}
          className="!pw-py-3 !pw-px-[42px] !pw-bg-[#295BA6] !pw-text-xs !pw-text-[#FFFFFF] pw-border pw-border-[#295BA6] !pw-rounded-full hover:pw-bg-[#295BA6] hover:pw-shadow-xl disabled:pw-bg-[#A5A5A5] disabled:pw-text-[#373737] active:pw-bg-[#EFEFEF]"
        >
          {parseFloat(orderPreview?.totalPrice ?? '0') !== 0
            ? translate('shared>continue')
            : 'Finalizar pedido'}
        </PixwayButton>
      </div>
      {requestError !== '' &&
        (requestErrorCode === 'resale-purchase-batch-size-error' ||
          requestErrorCode === 'Not Found') && (
          <Alert className="pw-mt-3" variant="error">
            {requestError}
          </Alert>
        )}
    </>
  );
}
