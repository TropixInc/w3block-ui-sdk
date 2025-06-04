/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";
import { useClickAway } from "react-use";

import { Label, Radio, RadioGroup } from "@headlessui/react";

import ArrowDown from "../../shared/assets/icons/arrowDown.svg";
import { Variants } from "../interfaces/Product";


interface Props {
  variants: Variants;
  onClick: (value: any) => void;
  productId: string;
  type?: string;
  borderColor?: string;
}

export const ProductVariants = ({
  variants,
  onClick,
  productId,
  type,
  borderColor,
}: Props) => {
  const [isOpened, setIsOpened] = useState(false);
  const [value, setValue] = useState(variants?.values?.[0]?.name ?? "");
  const [variantsValue, setVariantsValue] = useState(variants?.values[0]);
  const refToClickAway = useRef<HTMLDivElement>(null);
  useClickAway(refToClickAway, () => {
    if (isOpened) {
      setIsOpened(false);
    }
  });

  const radioGroupComponent = () => {
    return (
      <RadioGroup
        value={variantsValue}
        onChange={(val) => {
          const variant = {} as any;
          variant[variants.id as any] = {
            name: val.name,
            label: variants.name,
            id: val.id,
            productId,
            variantId: variants.id,
          };
          setValue(val.name);
          setVariantsValue(val);
          onClick({ ...variant });
        }}
        className="pw-mt-4"
      >
        <Label className="pw-text-sm pw-text-black pw-mb-1">
          {variants.name}
        </Label>
        <div className="pw-flex pw-justify-start pw-items-center pw-gap-3">
          {variants.values.map((val) => {
            return (
              <Radio key={val.id} value={val}>
                {({ checked }) => (
                  <div
                    className="pw-p-[10px_12px] pw-border pw-border-solid pw-rounded-[10px] pw-text-sm pw-font-semibold pw-cursor-pointer pw-text-black"
                    style={{ borderColor: checked ? borderColor : "#DCDCDC" }}
                  >
                    <span>{val.name}</span>
                  </div>
                )}
              </Radio>
            );
          })}
        </div>
      </RadioGroup>
    );
  };

  if (type === "radioGroup") return radioGroupComponent();

  return (
    <div ref={refToClickAway} className="pw-mt-4">
      <p className="pw-text-sm pw-text-black pw-mb-1">{variants.name}</p>
      <div
        onClick={() => setIsOpened(!isOpened)}
        className={`pw-p-3 pw-flex pw-items-center pw-rounded-lg pw-justify-between pw-cursor-pointer ${
          isOpened ? "pw-border-none pw-bg-white" : "pw-border pw-border-black"
        }`}
      >
        <p className="pw-text-xs pw-font-[600] pw-text-black pw-truncate">
          {value}
        </p>
        <ArrowDown className="pw-stroke-black" />
      </div>
      {isOpened && (
        <div className="pw-relative">
          <div className="pw-absolute pw-bg-white -pw-mt-1 pw-flex pw-flex-col pw-py-1 pw-rounded-b-l ">
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
                      keyLabel: variants.keyLabel,
                      keyValue: val.keyValue,
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
  );
};
