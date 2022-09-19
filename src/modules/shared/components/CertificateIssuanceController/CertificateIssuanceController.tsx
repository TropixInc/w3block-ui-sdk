import { useRef, useState } from 'react';

import { QRCodeCanvas } from 'qrcode.react';

import { useModalController } from '../../hooks/useModalController';
import { getPublicTokenPageURL } from '../../utils/getPublicTokenPageURL';
import { CertificateIssuanceModal } from '../CertificateIssuanceModal';
import { ConfirmationCertificateIssuedModal } from '../ConfirmationCertificateIssuedModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  transactionHash: string;
  contractAddress: string;
  name: string;
  image: string;
  description: string;
  originalOwnerWalletAddress: string;
  chainId: number;
  tokenId: string;
}

export const CertificateIssuanceController = ({
  isOpen,
  onClose,
  contractAddress,
  description,
  image,
  name,
  transactionHash,
  originalOwnerWalletAddress,
  chainId,
  tokenId,
}: Props) => {
  const [finished, setFinished] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const canvas = qrCodeRef.current?.children[0] as HTMLCanvasElement;
  const qrCodeSrc = canvas?.toDataURL();

  const {
    isOpen: isOpenConfirmationModal,
    openModal: openConfirmationModal,
    closeModal: closeConfirmationModal,
  } = useModalController();

  const handleConfirm = () => {
    setFinished(true);
    openConfirmationModal();
  };

  const handleCloseConfirmation = () => {
    onClose();
    setFinished(false);
    closeConfirmationModal();
  };

  return (
    <>
      <div ref={qrCodeRef} className="pw-absolute pw-left-0 -pw-top-[500px]">
        <QRCodeCanvas
          width={70}
          height={70}
          value={`${
            process.env.NEXT_PUBLIC_APP_BASE_PATH
          }${getPublicTokenPageURL({ chainId, contractAddress, tokenId })}`}
        />
      </div>
      {isOpen ? (
        <>
          <CertificateIssuanceModal
            QRCodeSrc={qrCodeSrc ?? ''}
            name={name}
            description={description}
            contractAddress={contractAddress}
            image={image}
            transactionHash={transactionHash}
            originalOwnerWalletAddress={originalOwnerWalletAddress}
            isOpen={isOpen && !finished}
            onClose={onClose}
            onConfirm={handleConfirm}
          />
          <ConfirmationCertificateIssuedModal
            isOpen={isOpenConfirmationModal}
            onClose={handleCloseConfirmation}
          />
        </>
      ) : null}
    </>
  );
};
