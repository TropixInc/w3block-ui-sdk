import { PaymentMethodsAvaiable } from '../../interface/interface';
import { PaymentAccordion } from '../PaymentAccordion/PaymentAccordion';

interface PaymentMethodsComponentProps {
  methods: PaymentMethodsAvaiable[];
  className?: string;
  onSelectedPayemnt: (method: PaymentMethodsAvaiable) => void;
  methodSelected: PaymentMethodsAvaiable;
}

export const PaymentMethodsComponent = ({
  methods,
  className = '',
  onSelectedPayemnt,
  methodSelected,
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
        />
      ))}
    </div>
  );
};
