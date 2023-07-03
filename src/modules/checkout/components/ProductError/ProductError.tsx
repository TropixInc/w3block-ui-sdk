import { ImageSDK } from '../../../shared/components/ImageSDK';
import { ProductErrorInterface } from '../../interface/interface';

interface ProductErrorProps {
  productsErrors: ProductErrorInterface[];
  className?: string;
}

export const ProductError = ({
  productsErrors,
  className,
}: ProductErrorProps) => {
  const getErrorMessage = (error: ProductErrorInterface) => {
    switch (error.error.code) {
      case 'insufficient-stock':
        return {
          title: `Estoque insuficiente`,
          message: `O item ${error.product?.name} não possui estoque suficiente para a quantidade solicitada. Quantidade disponível: ${error.product?.stockAmount}`,
        };
      case 'purchase-limit':
        return {
          title: `Limite de compra excedido`,
          message: `O item ${error.product?.name} possui limite de compra de ${error.error.limit} unidades por CPF/CNPJ.`,
        };
      default:
        return {
          title: `Erro ao processar o item ${error.product?.name}`,
          message: `Ocorreu um erro ao processar o item ${error.product?.name}. Por favor, tente novamente mais tarde.`,
        };
    }
  };
  return (
    <div className={` ${className}`}>
      <div className="pw-border pw-bg-red-50 pw-border-[rgba(0,0,0,0.1)] pw-rounded-2xl pw-overflow-hidden ">
        {productsErrors.map((error, index) => (
          <div
            key={error.product.id}
            className={`pw-flex pw-gap-4 pw-p-3 ${
              index != 0 ? 'pw-border-t' : ''
            }`}
          >
            <ImageSDK
              src={error.product.images[0].thumb}
              className="pw-w-[48px] pw-h-[48px] pw-rounded-lg pw-object-cover"
              width={500}
              quality="good"
            />
            <div className="">
              <p className="pw-font-[600] pw-text-[13px] pw-text-[#353945] pw-min-w-0 pw-truncate">
                {error.product.name}
              </p>
              <p className="pw-text-xs pw-text-red-600 pw-font-[700]">
                {getErrorMessage(error).title}
              </p>
              <p className="pw-text-xs pw-text-red-400">
                {getErrorMessage(error).message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
