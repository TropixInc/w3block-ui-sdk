import { Suspense } from 'react';

import { UseGetTemporaryUserCode } from '../../hooks/useGetTemporaryUserCode/useGetTemporaryUserCode';
import useIsMobile from '../../hooks/useIsMobile/useIsMobile';
import { useProfileWithKYC } from '../../hooks/useProfileWithKYC/useProfileWithKYC';
import { ImageSDK } from '../ImageSDK';
import { ModalBase } from '../ModalBase';
import { Shimmer } from '../Shimmer';

interface AuthenticateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthenticateModal = ({
  isOpen,
  onClose,
}: AuthenticateModalProps) => {
  const { profile } = useProfileWithKYC();
  const { data } = UseGetTemporaryUserCode();
  const isMobile = useIsMobile();

  return (
    <ModalBase
      classes={{ dialogCard: 'pw-max-w-[80%] sm:pw-max-w-[300px] ' }}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pw-flex pw-flex-col pw-items-center pw-justify-center">
        <p className="pw-text-center pw-text-zinc-700 pw-font-bold pw-text-2xl pw-truncate">
          {isMobile ? `Olá, ${profile?.name}` : 'Autenticar'}
        </p>
        <p className="pw-text-black pw-text-sm pw-mt-4 pw-text-center">
          Apresente esse código ao estabelecimento para efetuar seu pagamento.
        </p>

        <Suspense
          fallback={
            <Shimmer className="pw-w-[60px] pw-h-[24px] pw-rounded-full pw-mt-[16px]" />
          }
        >
          <p className="pw-text-black pw-text-2xl pw-font-bold pw-mt-[16px]">
            {data?.code}
          </p>
        </Suspense>

        <ImageSDK
          className="pw-w-[150px] pw-h-[150px] pw-rounded-full pw-object-cover pw-mt-4"
          width={150}
          height={150}
          src={profile?.avatarSrc}
        />
        <p className="pw-text-gray-700 pw-text-[15px] pw-font-semibold pw-mt-[16px] pw-text-center">
          {profile?.name}
        </p>
        <p className="pw-text-gray-700 pw-text-[15px] pw-font-semibold pw-mt-[2px] pw-text-center">
          {profile?.email}
        </p>
      </div>
    </ModalBase>
  );
};
