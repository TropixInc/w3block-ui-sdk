import { ReactComponent as CreditCardIcon } from '../../../shared/assets/icons/creditCardIcon.svg';
import { ReactComponent as PixIcon } from '../../../shared/assets/icons/pix.svg';
import { PaymentMethodsAvaiable } from '../../interface/interface';
interface PaymentAccordionProps {
  method: PaymentMethodsAvaiable;
  className?: string;
  selected: boolean;
  setSelected: (method: PaymentMethodsAvaiable) => void;
}

export const PaymentAccordion = ({
  method,
  className = '',
  selected,
  setSelected,
}: PaymentAccordionProps) => {
  const { text, description } = mapPaymentMethodToTextAndDescription(
    method.paymentMethod
  );

  const MapPayementToIcon = () => {
    switch (method.paymentMethod) {
      case 'credit_card':
        return (
          <div className="pw-w-5 ">
            <CreditCardIcon />
          </div>
        );
      case 'pix':
        return (
          <div className="pw-w-5 ">
            <PixIcon className="pw-min-w-5 pw-w-5" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      onClick={() => setSelected(method)}
      className={`pw-w-full pw-flex pw-items-center pw-px-4 pw-py-3 pw-bg-white pw-shadow-brand-shadow pw-rounded-lg pw-cursor-pointer pw-gap-x-5   ${className}`}
    >
      <div>
        <div className="pw-w-4 pw-h-4 pw-rounded-full pw-border pw-border-slate-200 pw-flex pw-items-center pw-justify-center shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)]">
          {selected && (
            <div className="pw-w-2 pw-h-2 pw-bg-blue-500 pw-rounded-full"></div>
          )}
        </div>
      </div>

      <MapPayementToIcon />
      <div>
        <p className="pw-text-[14px] pw-font-[600] pw-text-[#35394C]">{text}</p>
        <p className="pw-text-[12px] pw-font-[400] pw-text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
};

const mapPaymentMethodToTextAndDescription = (method: string) => {
  switch (method) {
    case 'credit_card':
      return {
        text: 'Cartão de crédito',
        description: 'Nós acetamos diferentes bandeiras de cartão',
      };
    case 'crypto':
      return {
        text: 'Crypto',
        description: 'Pagamento em crypto',
      };
    case 'boleto':
      return {
        text: 'Boleto bancário',
        description:
          'Vencimento em 1 dia útil. A data de entrega será alterada devido ao tempo de processamento do Boleto.',
      };
    case 'pix':
      return {
        text: 'Pix',
        description:
          'O código Pix gerado para o pagamento é válido por 30 minutos após a finalização do pedido.',
      };
    default:
      return {
        text: '',
        description: '',
      };
  }
};
