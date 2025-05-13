/* eslint-disable @typescript-eslint/no-explicit-any */
import UserIcon from '../../../assets/icons/usersOutlined.svg?react';
import { useCompanyById } from '../../../hooks/useCompanyById';
import { useCompanyConfig } from '../../../hooks/useCompanyConfig';
import { useGetUserByWalletAddress } from '../../../hooks/useGetUserByWalletAddress';
import useTranslation from '../../../hooks/useTranslation';
import { ErrorBox } from '../../ErrorBox';
import { Spinner } from '../../Spinner';

interface UserByWalletInputProps {
  wallet: string;
  onChangeWallet: (value: string) => void;
  openModal: () => void;
  walletValid: boolean;
  placeholder?: string;
}

export const UserByWalletInput = ({
  onChangeWallet,
  wallet,
  openModal,
  placeholder,
  walletValid,
}: UserByWalletInputProps) => {
  const [translate] = useTranslation();
  const { companyId, name } = useCompanyConfig();
  const { data: company } = useCompanyById(companyId);

  const { data, isLoading, error } = useGetUserByWalletAddress(
    walletValid ? wallet : ''
  );

  return error && (error as any).statusCode !== 404 ? (
    <ErrorBox customError={error as any} />
  ) : (
    <div>
      <div className="pw-w-full pw-flex pw-gap-x-2">
        <input
          value={wallet}
          type="text"
          placeholder={placeholder ?? ''}
          className="pw-outline-none pw-h-10 pw-text-sm pw-flex-1 pw-p-2 pw-border pw-border-blue2 pw-rounded-lg"
          onChange={(e) => onChangeWallet(e.target.value)}
        />
        <button
          onClick={openModal}
          className="pw-bg-blue-500 pw-text-sm pw-px-5 pw-text-white pw-rounded-lg"
        >
          <UserIcon className="pw-stroke-white" />
        </button>
      </div>
      {isLoading ? (
        <Spinner className="pw-mt-1 pw-w-5 pw-h-5 !pw-border-2" />
      ) : null}
      {wallet && walletValid && (
        <p className="pw-text-sm pw-font-medium pw-opacity-70">
          {(data?.data?.owner as any)?.email}
        </p>
      )}
      {wallet.length > 4 && !walletValid && (
        <p className="pw-text-sm pw-font-medium pw-opacity-70 pw-text-red-500">
          {translate('loyalty>shared>invalidWallet')}
        </p>
      )}
      {error && Number((error as any)?.statusCode) === 404 ? (
        <p className="pw-text-sm pw-font-medium pw-opacity-70">
          {wallet === company?.data?.defaultOwnerAddress
            ? `${translate('shared>GenericWalletFilter>keyWallet')} ${
                name ? '- ' + name : ''
              }`
            : translate('shared>GenericWalletFilter>walletNotFound')}
        </p>
      ) : null}
    </div>
  );
};
