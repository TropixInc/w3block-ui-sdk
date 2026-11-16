/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useMemo, useState } from 'react';
import { CurrencyInput } from 'react-currency-mask';
import { IMaskInput } from 'react-imask';

import { OrderPreviewResponse } from '../../interface/interface';
import { WalletWithBalance } from '../../utils/checkoutHelpers';

interface UseErc20PaymentInputProps {
  orderPreview: OrderPreviewResponse | null;
  isCoinPayment: boolean;
  isErc20: boolean;
  automaxLoyalty: boolean | undefined;
  organizedLoyalties: WalletWithBalance[] | undefined;
  translate: (key: string) => string;
}

export function useErc20PaymentInput({
  orderPreview,
  isCoinPayment,
  isErc20,
  automaxLoyalty,
  organizedLoyalties,
  translate,
}: UseErc20PaymentInputProps) {
  const [paymentAmount, setPaymentAmountState] = useState('');
  const [coinAmountPayment, setCoinAmountPayment] = useState('');
  const [coinError, setCoinError] = useState('');

  const setPaymentAmount = (v: string) => {
    setPaymentAmountState(v);
  };

  const payWithCoin = () => {
    if (parseFloat(coinAmountPayment) > parseFloat(paymentAmount)) {
      setCoinError(translate('checkout>checkoutInfo>coinError'));
      return false;
    }
    if (
      parseFloat(coinAmountPayment) >
      parseFloat(
        organizedLoyalties?.filter((wallet) => wallet.type == 'loyalty')?.[0]
          ?.balance ?? ''
      )
    ) {
      setCoinError(translate('business>userCard>insufficientFunds'));
      return false;
    } else {
      setCoinError('');
      return true;
    }
  };

  const changeValue = useCallback(
    (value: string) => {
      setPaymentAmountState(value);
      if (automaxLoyalty) {
        if (
          organizedLoyalties &&
          organizedLoyalties?.length > 0 &&
          organizedLoyalties?.some(
            (wallet) =>
              wallet?.type == 'loyalty' &&
              wallet?.balance &&
              parseFloat(wallet?.balance ?? '0') > 0
          )
        ) {
          const balance = parseFloat(
            organizedLoyalties.find(
              (wallet) =>
                wallet?.type == 'loyalty' &&
                wallet?.balance &&
                parseFloat(wallet?.balance ?? '0') > 0
            )?.balance ?? '0'
          );
          if (balance < parseFloat(value))
            setCoinAmountPayment(balance.toFixed(2));
          else if (balance > parseFloat(value) || balance == parseFloat(value))
            setCoinAmountPayment(value);
        } else setCoinAmountPayment('');
      }
    },
    [automaxLoyalty, organizedLoyalties]
  );

  const decimals = (orderPreview?.products?.[0] as any)?.requirements
    ?.erc20Decimals;

  const erc20decimals = useMemo(() => {
    if (decimals === undefined) return 'currencyMask';
    if (decimals === 0) return 'integer';
    if (decimals === 1 || decimals >= 3) return 'decimal';
    else return 'currencyMask';
  }, [decimals]);

  const Erc20Input = useMemo(() => {
    if (erc20decimals === 'decimal') {
      return (
        <IMaskInput
          inputMode="numeric"
          radix="."
          mask={Number}
          scale={decimals}
          value={paymentAmount}
          onAccept={(e) => changeValue(e)}
          className="pw-p-2 pw-rounded-lg pw-border pw-border-[#DCDCDC] pw-shadow-md pw-text-black focus:pw-outline-none pw-font-poppins"
          placeholder={'0.0'}
        />
      );
    } else if (erc20decimals === 'integer') {
      return (
        <IMaskInput
          inputMode="numeric"
          type="number"
          mask={/^\d+$/}
          radix="."
          value={paymentAmount}
          onAccept={(e) => changeValue(e)}
          className="pw-p-2 pw-rounded-lg pw-border pw-border-[#DCDCDC] pw-shadow-md pw-text-black focus:pw-outline-none pw-font-poppins"
          placeholder={'0'}
        />
      );
    } else {
      return (
        <CurrencyInput
          onChangeValue={(_, value) => {
            if (value) {
              changeValue(value as string);
            }
          }}
          value={paymentAmount}
          hideSymbol={isErc20 && !isCoinPayment}
          InputElement={
            <input
              inputMode="numeric"
              className="pw-p-2 pw-rounded-lg pw-border pw-border-[#DCDCDC] pw-shadow-md pw-text-black focus:pw-outline-none pw-font-poppins"
              placeholder={isErc20 && !isCoinPayment ? '0.00' : 'R$ 0,00'}
            />
          }
        />
      );
    }
  }, [changeValue, decimals, erc20decimals, isCoinPayment, isErc20, paymentAmount]);

  return {
    paymentAmount,
    setPaymentAmount,
    coinAmountPayment,
    setCoinAmountPayment,
    coinError,
    payWithCoin,
    changeValue,
    Erc20Input,
  };
}
