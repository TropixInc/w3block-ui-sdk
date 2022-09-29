import { useState } from 'react';

import { useModalController } from '../../hooks/useModalController';
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
  chainId,
  tokenId,
}: Props) => {
  const [finished, setFinished] = useState(false);

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
      {isOpen ? (
        <>
          <CertificateIssuanceModal
            contractAddress={contractAddress}
            tokenId={tokenId}
            chainId={chainId}
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
