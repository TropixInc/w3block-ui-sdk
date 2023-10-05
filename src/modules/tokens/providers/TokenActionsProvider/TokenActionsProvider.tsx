import { ReactNode, lazy, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const CertificateIssuanceController = lazy(() =>
  import('../../../shared/components/CertificateIssuanceController').then(
    (m) => ({ default: m.CertificateIssuanceController })
  )
);

const TokenTransferController = lazy(() =>
  import('../../components/TokenTransferController').then((m) => ({
    default: m.TokenTransferController,
  }))
);

import { useModalController } from '../../../shared/hooks/useModalController';
import {
  ITokenActionContext,
  TokenActionsContext,
} from '../../contexts/TokenActionsContext';
import { usePublicTokenData } from '../../hooks/usePublicTokenData';

interface Props {
  children?: ReactNode;
  collectionId: string;
  collectionName: string;
  imageSrc: string;
  contractAddress: string;
  name: string;
  chainId: number;
  tokenId: string;
  isInternalToken: boolean;
  editionId: string;
}

export const TokenActionsProvider = ({
  children,
  collectionId,
  collectionName,
  imageSrc,
  contractAddress,
  name,
  chainId,
  tokenId,
  isInternalToken,
  editionId,
}: Props) => {
  const [translate] = useTranslation();
  const { data: publicTokenResponse } = usePublicTokenData({
    chainId: chainId.toString(),
    tokenId,
    contractAddress,
    enabled: isInternalToken,
  });
  const {
    isOpen: isOpenTransferModal,
    openModal: openTransferModal,
    closeModal: closeTransferModal,
  } = useModalController();

  const {
    isOpen: isOpenCertificateModal,
    openModal: openCertificateModal,
    closeModal: closeCertificateModal,
  } = useModalController();

  const value = useMemo<ITokenActionContext>(
    () => [
      {
        id: 'Transferir',
        label: translate('tokens>tokenTransferController>transfer'),
        disabled: !isInternalToken,
        onClick: () => {
          openTransferModal();
        },
      },
      {
        id: 'Certificado',
        label: translate('tokens>tokenCardActions>certificate'),
        disabled: !isInternalToken,
        onClick: () => {
          openCertificateModal();
        },
      },
    ],
    [translate, isInternalToken, openTransferModal, openCertificateModal]
  );
  return (
    <TokenActionsContext.Provider value={value}>
      {children}
      <TokenTransferController
        isOpen={isOpenTransferModal}
        onClose={closeTransferModal}
        collectionName={collectionName}
        imageSrc={imageSrc}
        tokens={[
          {
            id: collectionId,
            number: tokenId,
            editionId: editionId,
          },
        ]}
      />
      <CertificateIssuanceController
        isOpen={isOpenCertificateModal}
        onClose={closeCertificateModal}
        transactionHash={publicTokenResponse?.data.edition.mintedHash ?? ''}
        contractAddress={contractAddress}
        name={name}
        image={imageSrc}
        description={publicTokenResponse?.data.information.description ?? ''}
        originalOwnerWalletAddress={
          publicTokenResponse?.data.token?.firstOwnerAddress ?? ''
        }
        chainId={chainId}
        tokenId={tokenId}
      />
    </TokenActionsContext.Provider>
  );
};
