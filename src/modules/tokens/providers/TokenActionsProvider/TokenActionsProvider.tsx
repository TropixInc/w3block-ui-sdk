import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useModalController } from '../../../shared/hooks/useModalController';
import { TokenTransferController } from '../../components/TokenTransferController';
import {
  ITokenActionContext,
  TokenActionsContext,
} from '../../contexts/TokenActionsContext';

interface Props {
  children?: ReactNode;
  collectionId: string;
  collectionName: string;
  imageSrc: string;
}

export const TokenActionsProvider = ({
  children,
  collectionId,
  collectionName,
  imageSrc,
}: Props) => {
  const [translate] = useTranslation();
  const {
    isOpen: isOpenTransferModal,
    openModal: openTransferModal,
    closeModal: closeTransferModal,
  } = useModalController();

  const value = useMemo<ITokenActionContext>(
    () => [
      {
        id: 'Transferir',
        label: translate('tokens>tokenTransferController>transfer'),
        disabled: true,
        onClick: () => {
          openTransferModal();
        },
      },
      {
        id: 'Certificado',
        label: translate('tokens>tokenCardActions>certificate'),
        disabled: false,
        onClick: () => {
          //
        },
      },
    ],
    [openTransferModal, translate]
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
            number: '1',
          },
        ]}
      />
    </TokenActionsContext.Provider>
  );
};
