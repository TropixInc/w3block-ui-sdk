/* eslint-disable i18next/no-literal-string */
import { useEffect } from 'react';

import { Spinner } from '../../../shared/components/Spinner';
import useTranslation from '../../../shared/hooks/useTranslation';
import { OffpixButtonBase } from '../../../tokens/components/DisplayCards/OffpixButtonBase';
import { useDeleMethodPayment } from '../../hooks/DeleteMethodPayment/useDeleMethodPayment';
import { WithdrawMethodDTO } from './WithdrawModal';

interface DeleteModalProps {
  onChangeModalType: (value: 'add' | 'withdraw' | 'delete') => void;
  itemForDelete: any;
}

const DeleteMethodModal = ({
  onChangeModalType,
  itemForDelete,
}: DeleteModalProps) => {
  const { mutate, isSuccess, isLoading } = useDeleMethodPayment();
  const [tranlate] = useTranslation();

  const onDeleteMethod = (id: string) => {
    try {
      mutate(id);
    } catch (err) {
      console.log((err as any).message);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      onChangeModalType('withdraw');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  return (
    <div className="pw-text-slate-900">
      <p className="pw-text-center pw-text-xl pw-font-medium">
        {tranlate('auth>deleteMethodModal>deleteMethod')}
      </p>
      <div>
        <table className="pw-mt-5 pw-w-full">
          <thead className="pw-w-full">
            <tr className="pw-w-full">
              <th scope="col" className="pw-text-left">
                {tranlate('auth>addMethodModal>type')}
              </th>
              <th scope="col" className="pw-text-left">
                {tranlate('auth>deleteMethodModal>holder')}
              </th>
              <th scope="col" className="pw-text-left">
                Key
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{(itemForDelete as WithdrawMethodDTO)?.type}</td>
              <td>
                {(itemForDelete as WithdrawMethodDTO)?.accountInfo?.ownerName}
              </td>
              <td>{(itemForDelete as WithdrawMethodDTO)?.accountInfo?.key}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="pw-flex pw-gap-x-4 pw-full pw-mt-5">
        <OffpixButtonBase
          variant="outlined"
          className="pw-h-10 pw-w-full pw-flex pw-justify-center pw-items-center pw-px-4 pw-text-base"
          onClick={() => onChangeModalType('withdraw')}
        >
          {tranlate('components>cancelMessage>cancel')}
        </OffpixButtonBase>
        <OffpixButtonBase
          onClick={() => onDeleteMethod(itemForDelete.id)}
          disabled={isLoading}
          className="pw-h-10 pw-w-full pw-flex pw-justify-center pw-items-center pw-px-4 pw-text-base"
        >
          {isLoading ? (
            <Spinner className="pw-w-4 pw-h-4 !pw-border-[2px]" />
          ) : (
            tranlate('shared>myProfile>confirm')
          )}
        </OffpixButtonBase>
      </div>
    </div>
  );
};

export default DeleteMethodModal;
