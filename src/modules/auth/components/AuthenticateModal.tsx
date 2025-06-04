import { Suspense } from 'react';
import { useProfileWithKYC } from '../../shared/hooks/useProfileWithKYC';
import { UseGetTemporaryUserCode } from '../../shared/hooks/useGetTemporaryUserCode';
import { useIsMobile } from '../../shared/hooks/useIsMobile';
import { useTranslation } from 'react-i18next';
import { ModalBase } from '../../shared/components/ModalBase';
import { Shimmer } from '../../shared/components/Shimmer';
import { ImageSDK } from '../../shared/components/ImageSDK';




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
  const [translate] = useTranslation();

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
          {translate('shared>authenticateModal>presenteToEstablishmentPayment')}
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
