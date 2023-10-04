import { useRef, useState } from 'react';
import { useClickAway } from 'react-use';

import ArrowDown from '../../../shared/assets/icons/arrowDown.svg?react';
import { formatterCurrency } from '../../../shared/components/CriptoValueComponent/CriptoValueComponent';
import { AvailableInstallmentInfo } from '../../interface/interface';
interface CheckoutInstalmentsProps {
  installments?: AvailableInstallmentInfo[];
  value?: AvailableInstallmentInfo;
  setInstallment?: (value: AvailableInstallmentInfo) => void;
  currency?: string;
}

export const CheckoutInstalments = ({
  installments,
  value,
  setInstallment,
  currency = 'BRL',
}: CheckoutInstalmentsProps) => {
  const [opened, setOpened] = useState<boolean>(false);
  const divRef = useRef<HTMLDivElement>(null);
  function generateStringText(installment: AvailableInstallmentInfo) {
    return `${installment.amount}x de ${formatterCurrency(currency).format(
      installment.installmentPrice
    )} ${
      installment.interest && installment.interest != 0
        ? `(${installment.interest}% de juros)`
        : 'sem juros'
    }`;
  }

  useClickAway(divRef, () => {
    setOpened(false);
  });

  return (
    <div ref={divRef} className="pw-full pw-mb-2">
      <div
        onClick={() => setOpened(!opened)}
        className="pw-border pw-border-slate-300 pw-rounded-lg pw-p-3 pw-text-sm pw-text-slate-700 pw-w-full pw-bg-white pw-flex pw-justify-between pw-items-center"
      >
        <p>
          {generateStringText(
            value ?? {
              amount: 0,
              finalPrice: '0',
              installmentPrice: 20,
              interest: 0,
            }
          )}
        </p>
        <ArrowDown className="pw-stroke-slate-700" />
      </div>
      {opened && (
        <div className="pw-relative">
          <div className="pw-absolute pw-z-10 pw-w-full pw-mt-2 pw-bg-white pw-border pw-border-slate-300 pw-py-2 pw-rounded-lg">
            {installments?.map((installment) => (
              <div
                key={installment.amount}
                onClick={() => {
                  setInstallment?.(installment);
                  setOpened(false);
                }}
                className="pw-flex pw-items-center pw-justify-between pw-py-2 pw-px-3 pw-cursor-pointer pw-text-slate-600 hover:pw-bg-slate-200"
              >
                <p className="pw-text-sm">{generateStringText(installment)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
