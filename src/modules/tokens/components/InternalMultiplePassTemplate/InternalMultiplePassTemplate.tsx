import { InternalPagesLayoutBase } from '../../../shared';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';

const _InternalMultiplePassTemplate = ({
  passName,
  contract,
}: {
  passName: string;
  contract: string;
}) => {
  return (
    <div className="pw-bg-white pw-font-poppins pw-rounded-[8px] pw-w-full pw-p-[16px_16px_24px] pw-flex pw-gap-[8px]">
      <div>
        <p className=" pw-font-normal pw-text-sm pw-text-[#777E8F]">
          Token Pass
        </p>
        <p className="pw-font-bold pw-text-2xl pw-leading-9 pw-text-black">
          {passName}
        </p>
        <div className="pw-flex pw-items-center pw-mt-3">
          <p className="pw-font-semibold pw-text-[15px] pw-leading-[22.5px] pw-text-black">
            Contrato utilizado:
          </p>
          <p className="pw-font-normal pw-ml-1 pw-text-[15px] pw-leading-[22.5px] pw-text-[#777E8F]">
            {contract}
          </p>
        </div>
      </div>
    </div>
  );
};

export const InternalMultiplePassTemplate = () => (
  <TranslatableComponent>
    <InternalPagesLayoutBase>
      <_InternalMultiplePassTemplate
        passName="Nome do Pass teste"
        contract="Contrato padrão"
      />
    </InternalPagesLayoutBase>
  </TranslatableComponent>
);
