import CreditCardIcon from '../../../shared/assets/icons/creditCardIcon.svg?react';
import PixIcon from '../../../shared/assets/icons/pix.svg?react';
import { PaymentMethodsAvaiable } from '../../interface/interface';
interface PaymentAccordionProps {
  method: PaymentMethodsAvaiable;
  className?: string;
  selected: boolean;
  setSelected: (method: PaymentMethodsAvaiable) => void;
  loadingPreview?: boolean;
}

export const PaymentAccordion = ({
  method,
  className = '',
  selected,
  setSelected,
  loadingPreview = false,
}: PaymentAccordionProps) => {
  const { text, description } = mapPaymentMethodToTextAndDescription(
    method.paymentMethod,
    method.availableInstallments?.length ?? 0,
    method.paymentProvider,
    method.providerData?.brlAmount
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
    <button
      disabled={loadingPreview}
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
      <div className="pw-text-left">
        <p className="pw-text-[14px] pw-font-[600] pw-text-[#35394C]">{text}</p>
        <p className="pw-text-[12px] pw-font-[400] pw-text-slate-500">
          {description}
        </p>
      </div>
    </button>
  );
};

const mapPaymentMethodToTextAndDescription = (
  method: string,
  installments?: number,
  provider?: string,
  convertedPrice?: string
) => {
  switch (method) {
    case 'credit_card':
      return {
        text: 'Cartão de crédito',
        description:
          (installments && installments > 0
            ? `Pagamento em até ${installments} parcelas`
            : 'Aceitamos as principais bandeiras do mercado') + '.',
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
          provider === 'braza'
            ? `Valor para pagamento em real + taxas = R$${convertedPrice}`
            : 'Aprovação imediata após o pagamento.',
      };
    case 'transfer':
      return {
        text: 'Transferência',
        description:
          'Após a finalização do pedido, você receberá um email com mais informações para pagamento',
      };
    default:
      return {
        text: '',
        description: '',
      };
  }
};
