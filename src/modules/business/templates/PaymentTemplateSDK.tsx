/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import { CurrencyInput } from 'react-currency-mask';
import { useDebounce } from 'react-use';

import classNames from 'classnames';

import { ErrorMessage } from '../../checkout/components/ErrorMessage';
import { BaseButton } from '../../shared/components/Buttons';
import { ErrorBox } from '../../shared/components/ErrorBox';
import { InternalPagesLayoutBase } from '../../shared/components/InternalPagesLayoutBase';
import { Spinner } from '../../shared/components/Spinner';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { SectionCard } from '../../shared/components/ui/SectionCard';
import { UI } from '../../shared/components/ui/tokens';
import { useGuardPagesWithOptions } from '../../shared/hooks/useGuardPagesWithOptions';
import useTranslation from '../../shared/hooks/useTranslation';
import { BuySummarySDK } from '../components/buySumarrySDK';
import { PayementCompletedModal } from '../components/PayementCompletedModal';
import { PaymentFailedModal } from '../components/PaymentFailedModal';
import { UserCard } from '../components/userCard';
import { useCreatePayment } from '../hooks/useCreatePayment';
import { useGetPaymentPreview } from '../hooks/useGetPaymentPreview';
import { useGetUserBalance } from '../hooks/useGetUserBalance';
import { useGetUserByCode } from '../hooks/useGetUserByCode';
import { useLoyaltiesInfo } from '../hooks/useLoyaltiesInfo';
import { UserInfoInterface } from '../interface/userInfo';

const Steps = ({ current, labels }: { current: number; labels: string[] }) => (
  <ol className="pw-flex pw-flex-wrap pw-items-center pw-gap-x-4 pw-gap-y-1 pw-m-0 pw-p-0 pw-list-none">
    {labels.map((label, index) => {
      const done = index < current;
      const active = index === current;
      return (
        <li
          key={label}
          className="pw-flex pw-items-center pw-gap-1.5 pw-text-[12.5px]"
        >
          <span
            className={classNames(
              'pw-grid pw-place-items-center pw-w-5 pw-h-5 pw-rounded-full pw-text-[11px] pw-font-semibold',
              done
                ? 'pw-bg-[#E6F6EF] pw-text-[#0B7A55]'
                : active
                ? 'pw-bg-brand-primary pw-text-white'
                : 'pw-bg-[#F1F3F6] pw-text-[#4A5567]'
            )}
          >
            {done ? '✓' : index + 1}
          </span>
          <span
            className={
              active ? classNames('pw-font-semibold', UI.text) : UI.textMuted
            }
          >
            {label}
          </span>
        </li>
      );
    })}
  </ol>
);

/**
 * Operator payment: amount → customer code → confirm. Same flow as before
 * (code lookup, balance, debounced preview, points as discount, create).
 */
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
  const [paymentFailedModal, setPaymentFailedModal] = useState<boolean>(false);
  const { loyalties } = useLoyaltiesInfo();
  const [codeError, setCodeError] = useState<string>('');
  const [userInfo, setUserInfo] = useState<UserInfoInterface>({});
  useGuardPagesWithOptions({ needBusiness: true, needUser: true });
  const { mutate, error, isPending: isVerifying } = useGetUserByCode();
  const { mutate: getUserBalance, error: errorGetUserBalance } =
    useGetUserBalance();
  const { mutate: getPaymentPreview, error: errorGetPaymentPreview } =
    useGetPaymentPreview();
  const { mutate: createPayment, error: errorCreatePayment } =
    useCreatePayment();
  const [translate] = useTranslation();

  const loyaltieToUse = useMemo(() => {
    return loyalties && loyalties.length ? loyalties[0] : undefined;
  }, [loyalties]);

  const handleVerification = () => {
    const codeString = code.join('').trim();
    if (codeString.length !== 4) {
      setCodeError(translate('business>paymentTemplateSDK>invalidCode'));
      return;
    }
    mutate(codeString, {
      onSuccess: (data: UserInfoInterface) => {
        setUserInfo(data);
        getUserBalance(data.id as string, {
          onSuccess: (balance) => {
            setUserInfo((prev) => ({ ...prev, ...balance[0] }));
            handleGetPaymentPreview();
          },
        });
      },
      onError: () => {
        setCodeError(translate('business>paymentTemplateSDK>invalidCode'));
      },
    });
  };

  useDebounce(() => handleGetPaymentPreview(), 100, [valueToPay, valueToUse]);

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
            setTotalDiscount(data.discount);
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
          onSuccess: () => {
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
          onError() {
            setPaymentFailedModal(true);
            setIsLoading(false);
          },
        }
      );
    }
  };

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

  const handleCancelUserCard = () => {
    setCode(['', '', '', '']);
    setUserInfo({});
    setCashbackPoints('0');
    setTotalDiscount('0');
  };

  const canConfirm =
    userInfo.id != undefined &&
    code.length == 4 &&
    valueToPay !== 0 &&
    !(valueToUse > parseFloat(userInfo?.balance ?? '0')) &&
    !isLoading;
  const step = userInfo.id ? 2 : valueToPay > 0 ? 1 : 0;

  return (
    <InternalPagesLayoutBase>
      <div className="pw-flex pw-flex-col pw-gap-4 pw-px-4 sm:pw-px-0">
        <PageHeader
          title={translate('checkout>components>checkoutInfo>payment')}
          subtitle={translate('business>paymentTemplateSDK>subtitle')}
        >
          <Steps
            current={step}
            labels={[
              translate('business>paymentTemplateSDK>stepValue'),
              translate('business>paymentTemplateSDK>stepCode'),
              translate('business>paymentTemplateSDK>stepConfirm'),
            ]}
          />
        </PageHeader>

        <div className="pw-grid pw-grid-cols-1 lg:pw-grid-cols-[minmax(0,3fr)_minmax(0,2fr)] pw-gap-4 pw-items-start">
          <SectionCard>
            <div className="pw-flex pw-flex-col pw-gap-5">
              <label className="pw-grid pw-gap-1.5">
                <span className={UI.label}>
                  {translate('business>paymentTemplateSDK>valuePayment')}
                </span>
                <CurrencyInput
                  onChangeValue={(_, value) => {
                    setValueToPay(value as number);
                    setTotalValue(value as string);
                  }}
                  value={valueToPay}
                  InputElement={
                    <input
                      placeholder="R$ 0,00"
                      inputMode="decimal"
                      className="pw-h-11 pw-px-3 pw-rounded-lg pw-border pw-border-[#E6E8EC] pw-text-[18px] pw-font-semibold pw-text-[#0F1729] pw-w-full focus:pw-outline-none focus:pw-border-brand-primary"
                    />
                  }
                />
              </label>

              <div className="pw-grid pw-gap-1.5">
                <span className={UI.label}>
                  {translate('business>paymentTemplateSDK>stepCode')}
                </span>
                <p
                  className={classNames(
                    'pw-text-[12.5px] pw-m-0',
                    UI.textMuted
                  )}
                >
                  {translate('business>paymentTemplateSDK>pleaseClientCode')}
                </p>
                <div className="pw-flex pw-flex-wrap pw-items-center pw-gap-3 pw-mt-1">
                  <div className="pw-flex pw-items-center pw-gap-2">
                    {code.map((_, index) => (
                      <input
                        key={index}
                        onKeyUp={(e) => keyUp(e, index)}
                        type="tel"
                        maxLength={1}
                        value={code[index]}
                        id={`input-${index}`}
                        onChange={(e) => changeInput(index, e)}
                        aria-label={`${translate(
                          'business>paymentTemplateSDK>stepCode'
                        )} ${index + 1}`}
                        className="pw-w-11 pw-h-12 pw-text-[20px] pw-font-semibold pw-text-center pw-text-[#0F1729] pw-border pw-border-[#E6E8EC] pw-rounded-lg focus:pw-outline-none focus:pw-border-brand-primary"
                      />
                    ))}
                  </div>
                  <BaseButton
                    onClick={handleVerification}
                    disabled={isVerifying}
                  >
                    {isVerifying ? (
                      <Spinner className="!pw-w-4 !pw-h-4 !pw-border-2" />
                    ) : (
                      translate('business>paymentTemplateSDK>verify')
                    )}
                  </BaseButton>
                </div>
                {codeError ? (
                  <ErrorMessage className="pw-mt-1" message={codeError} />
                ) : null}
                <ErrorBox customError={error as any} />
                <ErrorBox customError={errorGetUserBalance as any} />
              </div>
            </div>
          </SectionCard>

          <div className="pw-flex pw-flex-col pw-gap-4">
            <UserCard
              onChangeValue={setValueToUse}
              valueToUse={valueToUse}
              onCancel={handleCancelUserCard}
              name={userInfo.name}
              avatarSrc={userInfo.avatarUrl}
              balance={
                userInfo?.balance == 'NaN' || userInfo?.balance == ''
                  ? '0'
                  : userInfo?.balance
              }
              currency={userInfo?.currency}
              setMaxValue={() =>
                setValueToUse(parseFloat(userInfo?.balance ?? '0'))
              }
            />
            <ErrorBox customError={errorGetPaymentPreview as any} />
            <BuySummarySDK
              totalValue={valueToPay.toString()}
              currencyToUse={userInfo.currency}
              discountValue={totalDiscount}
              valueToPay={totalValue}
            />
            {cahsbackPoints && parseInt(cahsbackPoints) != 0 ? (
              <div className="pw-flex pw-justify-between pw-items-center pw-gap-3 pw-px-4 pw-py-3 pw-rounded-lg pw-bg-[#E6F6EF] pw-text-[#0B7A55] pw-text-[13px]">
                <span>
                  {translate(
                    'business>paymentTemplateSDK>totalCreditCurrency',
                    {
                      currency: userInfo?.currency,
                    }
                  )}
                </span>
                <span className="pw-font-semibold pw-tabular-nums">
                  {cahsbackPoints} {userInfo.currency}
                </span>
              </div>
            ) : null}
            <ErrorBox customError={errorCreatePayment as any} />
            <BaseButton
              fullWidth
              disabled={!canConfirm}
              onClick={() => handleSubmitPayment()}
            >
              {isLoading ? (
                <Spinner className="!pw-w-4 !pw-h-4 !pw-border-2" />
              ) : (
                translate('business>paymentTemplateSDK>confirm')
              )}
            </BaseButton>
          </div>
        </div>
      </div>
      <PayementCompletedModal
        isOpen={paymentCompletedModal}
        onClose={() => setPaymentCompletedModal(false)}
      />
      <PaymentFailedModal
        isOpen={paymentFailedModal}
        onClose={() => setPaymentFailedModal(false)}
      />
    </InternalPagesLayoutBase>
  );
};
