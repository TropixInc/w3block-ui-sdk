/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from 'react';
import { useClickAway } from 'react-use';

import { ReactComponent as ArrowDown } from '../../shared/assets/icons/arrowDown.svg';
import { Variants } from '../hooks/useGetProductBySlug/useGetProductBySlug';

interface Props {
  variants: Variants;
  onClick: (value: any) => void;
  productId: string;
}

export const ProductVariants = ({ variants, onClick, productId }: Props) => {
  const [isOpened, setIsOpened] = useState(false);
  const [value, setValue] = useState(variants?.values?.[0]?.name ?? '');

  const refToClickAway = useRef<HTMLDivElement>(null);
  useClickAway(refToClickAway, () => {
    if (isOpened) {
      setIsOpened(false);
    }
  });

  return (
    <div>
      <div ref={refToClickAway} className="pw-mt-4">
        <p className="pw-text-sm pw-text-black pw-mb-1">{variants.name}</p>
        <div
          onClick={() => setIsOpened(!isOpened)}
          className={`pw-w-[120px]  pw-p-3 pw-flex pw-items-center pw-rounded-lg pw-justify-between pw-cursor-pointer ${
            isOpened
              ? 'pw-border-none pw-bg-white'
              : 'pw-border pw-border-black'
          }`}
        >
          <p className="pw-text-xs pw-font-[600] pw-text-black pw-truncate">
            {value}
          </p>
          <ArrowDown className="pw-stroke-black" />
        </div>
        {isOpened && (
          <div className="pw-relative">
            <div className="pw-absolute pw-bg-white -pw-mt-1 pw-w-[120px] pw-flex pw-flex-col pw-py-1 pw-rounded-b-l ">
              <div className="pw-border-t pw-bg-slate-400 pw-mx-3 pw-h-px"></div>
              <div className=""></div>
              <div className="pw-max-h-[180px] pw-overflow-y-auto">
                {variants.values.map((val) => (
                  <p
                    onClick={() => {
                      const variant = {} as any;
                      variant[variants.id as any] = {
                        name: val.name,
                        label: variants.name,
                        id: val.id,
                        productId,
                        variantId: variants.id,
                      };
                      setIsOpened(false);
                      setValue(val.name);
                      onClick({ ...variant });
                    }}
                    key={val.id}
                    className="pw-px-3 pw-py-2 pw-truncate pw-text-sm pw-cursor-pointer hover:pw-bg-slate-100 pw-text-black"
                  >
                    {val.name}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
