import { CheckoutStatus } from '../../../checkout';

interface ProductInfoProps {
  status?: CheckoutStatus;
  image: string;
  name: string;
  id: string;
  price: string;
  className?: string;
}

export const ProductInfo = ({
  image,
  name,
  id,
  price,
  className,
}: ProductInfoProps) => {
  return (
    <div
      className={`pw-w-full pw-px-2 pw-py-3 pw-flex pw-justify-between pw-items-center pw-border pw-border-[rgba(0,0,0,0.2)] pw-rounded-2xl ${className}`}
    >
      <div className="pw-flex pw-items-center">
        <div className="pw-w-[48px] pw-h-[48px] pw-rounded-lg pw-overflow-hidden">
          <img
            className="pw-w-[48px] pw-h-[48px] pw-rounded-lg pw-object-cover"
            src={image}
          />
        </div>
        <div className="pw-ml-3">
          <p className="pw-font-[600] pw-text-sm pw-text-[#353945]">{name}</p>
          <p className="pw-font-[600] pw-text-xs pw-text-[#353945]">{id}</p>
        </div>
      </div>
      <p className="pw-font-[700] pw-text-[#35394C] pw-text-lg">R${price}</p>
    </div>
  );
};
