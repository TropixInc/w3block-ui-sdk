import { UserDocumentStatus } from '@w3block/sdk-id';

import useGetProductById from '../../../../storefront/hooks/useGetProductById/useGetProductById';
import LabelWithRequired from '../../LabelWithRequired';

interface InputProductsProps {
  label: string;
  name: string;
  docValue?: any;
  docStatus?: UserDocumentStatus;
  hidenValidations?: boolean;
  required?: boolean;
}

const InputProducts = ({
  label,
  name,
  docValue,
  required,
}: InputProductsProps) => {
  const { data: product } = useGetProductById(docValue?.productId ?? '');

  return product ? (
    <div className="pw-mb-7">
      <LabelWithRequired name={name} required={required} haveColon={false}>
        {label}
      </LabelWithRequired>
      <div>
        <div className="pw-flex pw-justify-between pw-flex-wrap pw-w-full pw-border pw-border-slate-400 pw-p-3 pw-rounded-lg pw-items-center">
          <div className="pw-flex pw-gap-x-3 pw-items-center pw-w-full">
            <div className="pw-w-[80px] pw-h-[80px] pw-rounded-md pw-overflow-hidden ">
              <img
                className="pw-w-[100px] pw-h-[100px] pw-object-cover pw-rounded-sm"
                src={product?.images[0]?.thumb}
                alt=""
              />
            </div>
            <div className="pw-flex pw-justify-between pw-flex-wrap pw-flex-1">
              <p>{product?.name}</p>
              <p>{`Quantidade: ${docValue?.quantity}`}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default InputProducts;
