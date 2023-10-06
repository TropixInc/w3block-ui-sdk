import { lazy } from 'react';

import { PaymentMethodsAvaiable } from '../../interface/interface';
const PaymentAccordion = lazy(() =>
  import('../PaymentAccordion/PaymentAccordion').then((m) => ({
    default: m.PaymentAccordion,
  }))
);

interface PaymentMethodsComponentProps {
  methods: PaymentMethodsAvaiable[];
  className?: string;
  onSelectedPayemnt: (method: PaymentMethodsAvaiable) => void;
  methodSelected: PaymentMethodsAvaiable;
  loadingPreview?: boolean;
}

export const PaymentMethodsComponent = ({
  methods,
  className = '',
  onSelectedPayemnt,
  methodSelected,
  loadingPreview = false,
}: PaymentMethodsComponentProps) => {
  return (
    <div className={`${className}`}>
      <p className="pw-text-[18px] pw-font-[700] pw-text-[#35394C]">
        Métodos de pagamento
      </p>
      {methods.map((method) => (
        <PaymentAccordion
          selected={methodSelected.paymentMethod === method.paymentMethod}
          setSelected={onSelectedPayemnt}
          className="pw-mt-3"
          key={method.paymentMethod}
          method={method}
          loadingPreview={loadingPreview}
        />
      ))}
    </div>
  );
};
