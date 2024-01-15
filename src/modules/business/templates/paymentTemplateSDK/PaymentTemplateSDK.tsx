/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy, useEffect, useMemo, useState } from 'react';
import { CurrencyInput } from 'react-currency-mask';
import { useDebounce } from 'react-use';

import './index.css';

import { useGuardPagesWithOptions } from '../../../shared/hooks/useGuardPagesWithOptions/useGuardPagesWithOptions';
import { useCreatePayment } from '../../hooks/useCreatePayment';
import { useGetPaymentPreview } from '../../hooks/useGetPaymentPreview';
import { useGetUserBalance } from '../../hooks/useGetUserBalance';
import { useGetUserByCode } from '../../hooks/useGetUserByCode';
import { useLoyaltiesInfo } from '../../hooks/useLoyaltiesInfo';
import { UserInfoInterface } from '../../interface/userInfo';

const ErrorMessage = lazy(() =>
  import('../../../checkout/components/ErrorMessage/ErrorMessage').then(
    (mod) => ({ default: mod.ErrorMessage })
  )
);

const InternalPagesLayoutBase = lazy(() =>
  import(
    '../../../shared/components/InternalPagesLayoutBase/InternalPagesLayoutBase'
  ).then((mod) => ({ default: mod.InternalPagesLayoutBase }))
);

const BuySummarySDK = lazy(() =>
  import('../../components/buySumarySDK/buySumarrySDK').then((mod) => ({
    default: mod.BuySummarySDK,
  }))
);

const PayementCompletedModal = lazy(() =>
  import('../../components/paymentCompletedModal/PayementCompletedModal').then(
    (mod) => ({ default: mod.PayementCompletedModal })
  )
);

const UserCard = lazy(() =>
  import('../../components/userCard/userCard').then((mod) => ({
    default: mod.UserCard,
  }))
);

export const PaymentTemplateSDK = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [valueToPay, setValueToPay] = useState(0);
  const [valueToUse, setValueToUse] = useState<number>(0);
  const [totalValue, setTotalValue] = useState('');
  const [cahsbackPoints, setCashbackPoints] = useState<string>('');
  const [totalDiscount, setTotalDiscount] = useState<string>('');
  const [code, setCode] = useState(['', '', '', '']);
  const [paymentCompletedModal, setPaymentCompletedModal] =
    useState<boolean>(false);
  const { loyalties } = useLoyaltiesInfo();
  const [codeError, setCodeError] = useState<string>('');
  const [userInfo, setUserInfo] = useState<UserInfoInterface>({});
  useGuardPagesWithOptions({ needBusiness: true, needUser: true });
  const { mutate } = useGetUserByCode();
  const { mutate: getUserBalance } = useGetUserBalance();
  const { mutate: getPaymentPreview } = useGetPaymentPreview();
  const { mutate: createPayment } = useCreatePayment();

  const loyaltieToUse = useMemo(() => {
    return loyalties && loyalties.length ? loyalties[0] : undefined;
  }, [loyalties]);

  const handleVerification = () => {
    const codeString = code.join('').trim();
    if (codeString.length !== 4) {
      setCodeError('Código inválido');
      return;
    }
    mutate(codeString, {
      onSuccess: (data: UserInfoInterface) => {
        setUserInfo(data);
        getUserBalance(data.id as string, {
          onSuccess: (balance) => {
            setUserInfo((prev) => ({ ...prev, ...balance[0] }));
            const balanceNormal = parseFloat(balance[0].balance ?? '0');
            const pointsValue =
              loyalties[0].paymentViewSettings.pointsEquivalent.pointsValue;
            // const currencyValue =
            //   loyalties[0].paymentViewSettings.pointsEquivalent.currencyValue;
            const totalMoney = balanceNormal * pointsValue;
            if (totalMoney <= valueToPay) {
              setValueToUse(balanceNormal);
            } else {
              setValueToUse(valueToPay / pointsValue);
            }
            handleGetPaymentPreview();
          },
        });
      },
      onError: () => {
        setCodeError('Código inválido');
      },
    });
  };

  useDebounce(() => handleGetPaymentPreview(), 600, [valueToPay, valueToUse]);

  useEffect(() => {
    handleGetPaymentPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  const handleGetPaymentPreview = () => {
    if (userInfo.id && code.length == 4 && loyaltieToUse?.id) {
      getPaymentPreview(
        {
          amount: valueToPay.toString(),
          points:
            valueToUse == 0 || isNaN(valueToUse) || !valueToUse
              ? '0'
              : valueToUse.toString(),
          userId: userInfo.id as string,
          userCode: code.join('') as string,
          loyaltyId: loyaltieToUse?.id as string,
        },
        {
          onSuccess: (data) => {
            setCashbackPoints(data.pointsCashback);
            //setValueToPay(data.amount);
            setTotalDiscount(data.discount);
            //setValueToUse(data.discount);
            setTotalValue(data.total);
          },
          onError: () => {
            setTotalDiscount('');
            setCashbackPoints('');
          },
        }
      );
    }
  };

  const handleSubmitPayment = () => {
    if (userInfo.id && code.length == 4 && loyaltieToUse?.id) {
      setIsLoading(true);
      createPayment(
        {
          amount: valueToPay.toString(),
          points: valueToUse === 0 ? '0' : valueToUse.toString(),
          userId: userInfo.id as string,
          userCode: code.join('') as string,
          loyaltyId: loyaltieToUse?.id as string,
          description: '',
        },
        {
          onSuccess: (_) => {
            setPaymentCompletedModal(true);
            setCode(['', '', '', '']);
            setValueToPay(0);
            setValueToUse(0);
            setUserInfo({});
            setCashbackPoints('');
            setTotalDiscount('');
            setTotalValue('');
            setIsLoading(false);
          },
          onError(error) {
            console.log(error);
          },
        }
      );
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const keyUp = (e: any, index: number) => {
    if (e.code === 'Backspace' && code[index] == '') {
      const previous = document.getElementById(`input-${index - 1}`);
      previous?.focus();
    }
  };

  const changeInput = (index: number, e: any) => {
    const inputsToChange = code;
    inputsToChange[index] = e.target.value;
    setCode([...inputsToChange]);
    setCodeError('');
    setUserInfo({});
    setCashbackPoints('');
    setTotalDiscount('');
    setTotalValue('');

    if (e.nativeEvent.inputType !== 'deleteContentBackward') {
      const next = document.getElementById(`input-${index + 1}`);
      next?.focus();
    }
  };

  const handleValueToUse = () => {
    if (valueToUse == 0) {
      setValueToUse(0);
      return;
    }
    if (loyalties.length) {
      const pointsValue =
        loyalties[0].paymentViewSettings.pointsEquivalent.pointsValue;
      const amountTotalPoints = valueToPay / pointsValue;
      if (valueToUse > amountTotalPoints) {
        setValueToUse(amountTotalPoints);
      }
    }

    if (userInfo.balance && valueToUse > parseFloat(userInfo.balance)) {
      setValueToUse(parseFloat(userInfo.balance));
      return;
    } else if (valueToUse < 0) {
      setValueToUse(0);
      return;
    }
  };

  const handleChangeValueTopay = () => {
    if (loyalties.length > 0) {
      const pointsValue =
        loyalties[0].paymentViewSettings.pointsEquivalent.pointsValue;
      const totalMoney = parseFloat(userInfo.balance ?? '0') * pointsValue;

      if (totalMoney <= valueToPay && userInfo.balance) {
        setValueToUse(parseFloat(userInfo.balance));
      } else if (valueToPay != 0) {
        setValueToUse(valueToPay / pointsValue);
      } else {
        setValueToUse(0);
      }
    }
  };

  useDebounce(
    () => {
      handleChangeValueTopay();
    },
    600,
    [valueToPay]
  );

  useDebounce(
    () => {
      handleValueToUse();
    },
    500,
    [valueToUse]
  );

  const handleCancelUserCard = () => {
    setCode(['', '', '', '']);
    setUserInfo({});
    setCashbackPoints('0');
    setTotalDiscount('0');
  };

  return (
    <InternalPagesLayoutBase>
      <div className="pw-p-6 pw-bg-white pw-rounded-[20px] pw-shadow ">
        <p className="pw-text-black pw-text-[23px] pw-font-semibold pw-leading-loose">
          Pagamento
        </p>
        <div className="pw-p-4 pw-rounded-2xl pw-border-zinc-100 pw-shadow pw-border">
          <p className="pw-text-sm pw-text-zinc-700 pw-font-semibold">
            Valor a ser pago
          </p>
          <CurrencyInput
            onChangeValue={(_, value) => {
              setValueToPay(value as number);
              setTotalValue(value as string);
            }}
            value={valueToPay}
            InputElement={
              <input
                placeholder="Apenas numeros"
                className="pw-text-[13px] pw-text-black pw-p-[10px] pw-border pw-border-blue-600 pw-rounded-lg pw-w-full"
              />
            }
          />
        </div>
        <div className="pw-flex-col sm:pw-flex-row pw-flex first-letter pw-gap-[32px] pw-mt-[32px]">
          <div className="pw-p-4 pw-flex-1 pw-rounded-2xl pw-shadow pw-border pw-border-zinc-100 pw-flex pw-flex-col pw-justify-center pw-items-center pw-gap-[20px]">
            <p className="pw-text-zinc-700 pw-text-sm sm:pw-text-lg pw-font-medium pw-leading-[23px] pw-max-w-[260px] pw-text-center">
              Por favor solicite o código ao cliente e digite abaixo:
            </p>
            <div>
              <div className="pw-flex pw-justify-center pw-items-center pw-gap-2">
                {code.map((_, index) => (
                  <input
                    key={index}
                    onKeyUp={(e) => keyUp(e, index)}
                    type="tel"
                    maxLength={1}
                    value={code[index]}
                    id={`input-${index}`}
                    onChange={(e) => changeInput(index, e)}
                    style={{
                      width: '40px',
                      height: '40px',
                    }}
                    className="pw-text-[16px] pw-text-center pw-text-black pw-p-[6px] pw-border pw-border-blue-600 pw-rounded-lg pw-w-full"
                  />
                ))}
              </div>
              {codeError && (
                <ErrorMessage className="pw-mt-4" message={codeError} />
              )}
            </div>

            <button
              onClick={handleVerification}
              className=" pw-px-12 pw-py-[5px] pw-bg-zinc-100 pw-rounded-[48px] pw-border pw-border-zinc-300  "
            >
              <p className="pw-text-center pw-text-slate-500 pw-text-xs pw-font-medium">
                Verificar
              </p>
            </button>
          </div>
          <UserCard
            onChangeValue={setValueToUse}
            valueToUse={valueToUse}
            onCancel={handleCancelUserCard}
            name={userInfo.name}
            avatarSrc={userInfo.avatarUrl}
            balance={
              userInfo.balance == 'NaN' || userInfo.balance == ''
                ? '0'
                : userInfo.balance
            }
            currency={userInfo.currency}
          />
        </div>
        <BuySummarySDK
          className="pw-mt-[32px]"
          totalValue={valueToPay.toString()}
          currencyToUse={userInfo.currency}
          discountValue={totalDiscount}
          valueToPay={totalValue}
        />
        {cahsbackPoints && parseInt(cahsbackPoints) != 0 ? (
          <div className="pw-flex pw-justify-between pw-items-center pw-p-6 pw-bg-green-100 pw-rounded-2xl pw-mt-8">
            <p className="pw-text-gray-700 pw-text-sm">
              Total de {userInfo.currency} a ser creditado
            </p>
            <p className="pw-text-gray-700 pw-text-sm pw-font-semibold">
              {cahsbackPoints} {userInfo.currency}
            </p>
          </div>
        ) : null}
        <div className="pw-flex pw-justify-end pw-mt-[32px]">
          <button
            disabled={
              userInfo.id == undefined ||
              code.length != 4 ||
              valueToPay === 0 ||
              isLoading
            }
            onClick={() => handleSubmitPayment()}
            className={`pw-px-6 pw-py-[6px] pw-bg-blue-800 pw-rounded-full pw-shadow pw-border-b pw-border-white pw-text-white pw-text-xs pw-font-medium ${
              userInfo.id == undefined ||
              code.length != 4 ||
              valueToPay === 0 ||
              isLoading
                ? 'pw-opacity-50'
                : ''
            }`}
          >
            Confirmar
          </button>
        </div>
      </div>
      <PayementCompletedModal
        isOpen={paymentCompletedModal}
        onClose={() => setPaymentCompletedModal(false)}
      />
    </InternalPagesLayoutBase>
  );
};
