import { lazy, useState } from 'react';

import { useModalController } from '../../hooks/useModalController';
const CertificateIssuanceModal = lazy(() =>
  import('../CertificateIssuanceModal').then((module) => ({
    default: module.CertificateIssuanceModal,
  }))
);

const ConfirmationCertificateIssuedModal = lazy(() =>
  import('../ConfirmationCertificateIssuedModal').then((module) => ({
    default: module.ConfirmationCertificateIssuedModal,
  }))
);

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
