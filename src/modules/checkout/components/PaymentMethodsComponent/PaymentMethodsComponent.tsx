import { lazy } from 'react';

import classNames from 'classnames';

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
  title?: string;
  titleClass?: string;
}

export const PaymentMethodsComponent = ({
  methods,
  className = '',
  onSelectedPayemnt,
  methodSelected,
  loadingPreview = false,
  title = 'Métodos de pagamento',
  titleClass,
}: PaymentMethodsComponentProps) => {
  if (methods.length > 0)
    return (
      <div className={`${className}`}>
        <p
          className={classNames(
            titleClass,
            'pw-text-[18px] pw-font-[700] pw-text-[#35394C]'
          )}
        >
          {title}
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
  else return null;
};
