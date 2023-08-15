import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'react-use';

import { ErrorMessage } from '../../../checkout/components/ErrorMessage/ErrorMessage';
import { InternalPagesLayoutBase } from '../../../shared';
import './index.css';
import { useGuardPagesWithOptions } from '../../../shared/hooks/useGuardPagesWithOptions/useGuardPagesWithOptions';
import { BuySummarySDK } from '../../components/buySumarySDK/buySumarrySDK';
import { UserCard } from '../../components/userCard/userCard';
import { useCreatePayment } from '../../hooks/useCreatePayment';
import { useGetPaymentPreview } from '../../hooks/useGetPaymentPreview';
import { useGetUserBalance } from '../../hooks/useGetUserBalance';
import { useGetUserByCode } from '../../hooks/useGetUserByCode';
import { useLoyaltiesInfo } from '../../hooks/useLoyaltiesInfo';
import { UserInfoInterface } from '../../interface/userInfo';

export const PaymentTemplateSDK = () => {
  const [valueToPay, setValueToPay] = useState('0');
  const [valueToUse, setValueToUse] = useState('');
  const [totalValue, setTotalValue] = useState();
  const [cahsbackPoints, setCashbackPoints] = useState<string>('');
  const [code, setCode] = useState(['', '', '', '']);
  const { loyalties } = useLoyaltiesInfo();
  const [codeError, setCodeError] = useState<string>('');
  const [userInfo, setUserInfo] = useState<UserInfoInterface>({});
  useGuardPagesWithOptions({ needBusiness: true });
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
            setUserInfo({ ...data, ...balance });
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
          amount: valueToPay,
          points: valueToUse,
          userId: userInfo.id as string,
          userCode: code.join('') as string,
          loyaltyId: loyaltieToUse?.id as string,
        },
        {
          onSuccess: (data) => {
            setCashbackPoints(data.pointsCashback);
            setValueToPay(data.amount);
            setValueToUse(data.discount);
            setTotalValue(data.total);
          },
        }
      );
    }
  };

  const handleSubmitPayment = () => {
    if (userInfo.id && code.length == 4 && loyaltieToUse?.id) {
      createPayment(
        {
          amount: valueToPay,
          points: valueToUse,
          userId: userInfo.id as string,
          userCode: code.join('') as string,
          loyaltyId: loyaltieToUse?.id as string,
          description: '',
        },
        {
          onSuccess: (data) => {
            console.log(data);
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
    if (e.nativeEvent.inputType !== 'deleteContentBackward') {
      const next = document.getElementById(`input-${index + 1}`);
      next?.focus();
    }
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
          <input
            placeholder="Apenas numeros"
            type="number"
            value={valueToPay}
            onChange={(e) => setValueToPay(e.target.value)}
            className="pw-text-[13px] pw-text-black pw-p-[10px] pw-border pw-border-blue-600 pw-rounded-lg pw-w-full"
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
            onCancel={() => setUserInfo({})}
            name={userInfo.name}
            avatarSrc={userInfo.avatarUrl}
            balance={userInfo.balance}
            currency={userInfo.currency}
          />
        </div>
        <BuySummarySDK
          className="pw-mt-[32px]"
          totalValue={totalValue ?? valueToPay}
          discountValue={valueToUse}
          valueToPay={valueToPay}
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
            onClick={() => handleSubmitPayment()}
            className="pw-px-6 pw-py-[6px] pw-bg-blue-800 pw-rounded-full pw-shadow pw-border-b pw-border-white pw-text-white pw-text-xs pw-font-medium"
          >
            Confirmar
          </button>
        </div>
      </div>
    </InternalPagesLayoutBase>
  );
};
