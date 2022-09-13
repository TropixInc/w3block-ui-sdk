import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useModalController } from '../../../shared/hooks/useModalController';
import TokenTransferController from '../../components/TokenTransferController/TokenTransferController';
import {
  ITokenActionContext,
  TokenActionsContext,
} from '../../contexts/TokenActionsContext';

interface Props {
  children?: ReactNode;
  collectionId: string;
  collectionName: string;
}

export const TokenActionsProvider = ({
  children,
  collectionId,
  collectionName,
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
        disabled: false,
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
        collectionId={collectionId}
        collectionName={collectionName}
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
