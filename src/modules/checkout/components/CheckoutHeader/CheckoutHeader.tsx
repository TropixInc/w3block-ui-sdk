import { useTranslation } from 'react-i18next';

import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { useQuery } from '../../../shared/hooks/useQuery';
import useRouter from '../../../shared/hooks/useRouter';

interface CheckoutHeaderProps {
  onClick?: (query: string) => void;
}

const _CheckoutHeader = ({ onClick }: CheckoutHeaderProps) => {
  const [translate] = useTranslation();
  const query = useQuery();
  console.log(query);
  const router = useRouter();
  return (
    <div className="pw-w-full pw-bg-[#EDEDED]">
      <div className="pw-container pw-mx-auto pw-flex pw-items-center pw-py-6">
        <div
          onClick={onClick ? () => onClick(query) : () => router.back()}
          className="pw-bg-[#F7F7F7] pw-w-[36px] pw-h-[36px] pw-rounded-full pw-border-[0.7px] pw-border-[#777E8F] pw-flex pw-justify-center pw-items-center pw-cursor-pointer"
        >
          {/* TODO - Trocar isso pelo icone de > ... esperando apenas o percegaroli subir as mudanças dele para adicionar o icones */}
          <p>{'<'}</p>
        </div>
        <p
          onClick={onClick ? () => onClick(query) : () => router.back()}
          className="pw-ml-4 pw-text-[#777E8F] pw-text-sm pw-cursor-pointer"
        >
          {translate('shared>back')}
        </p>
      </div>
    </div>
  );
};

export const CheckoutHeader = ({ onClick }: CheckoutHeaderProps) => {
  return (
    <TranslatableComponent>
      <_CheckoutHeader onClick={onClick} />
    </TranslatableComponent>
  );
};
