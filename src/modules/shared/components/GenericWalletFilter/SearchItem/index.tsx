import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import classNames from 'classnames';

import { OffpixButtonBase } from '../../../../tokens/components/DisplayCards/OffpixButtonBase';
import { useGetUserByTenant } from '../../../hooks/useGetUsersByTenant';
import { Alert } from '../../Alert';
import { BaseSelect } from '../../BaseSelect';
import { Option } from '../../GenericSearchFilter/GenericSearchFilter';

interface SearchItemProps {
  isOpen: boolean;
  onClose: () => void;
  handleChangeWallet: (value: string) => void;
}

export const SearchItem = ({
  isOpen,
  onClose,
  handleChangeWallet,
}: SearchItemProps) => {
  const [onSearch, setOnSearch] = useState('');
  const [translate] = useTranslation();
  const [selectedOption, setSelectedOption] = useState<Option>();

  const { data: contacts, isError } = useGetUserByTenant({
    enabled: Boolean(onSearch.length > 2),
    params: { search: onSearch },
  });

  const onCancel = () => {
    setSelectedOption(undefined);
    onClose();
  };

  const options = useMemo(() => {
    if (contacts?.data?.items) {
      const selectOptions: Array<Option> = contacts?.data?.items.map(
        (item) => ({
          label: item.email,
          value: item.mainWallet.address,
          subtitle: item.name,
        })
      );

      return selectOptions;
    } else return [];
  }, [contacts?.data?.items]);

  useEffect(() => {
    if (selectedOption?.label) {
      setOnSearch(selectedOption?.label);
    }
  }, [selectedOption?.label]);

  useEffect(() => {
    if (selectedOption) {
      handleChangeWallet(selectedOption.value);

      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption]);

  return (
    <div className={classNames(isOpen ? 'pw-block mt-2' : 'pw-hidden')}>
      <div className="!pw-w-full">
        <BaseSelect
          options={options}
          search
          searchValue={onSearch}
          setSearch={setOnSearch}
          onChangeValue={setSelectedOption}
          value={selectedOption}
          placeholder={translate('loyalty>shared>searchPerUser')}
          classes={{ button: 'w-full' }}
        />
        {isError ? (
          <Alert className="pw-mt-2" variant="error">
            {translate('contacts>clientsInterface>errorAlert')}
          </Alert>
        ) : null}
        <div className="pw-mt-2 pw-flex pw-gap-x-3 pw-w-full pw-justify-end">
          <OffpixButtonBase
            onClick={onCancel}
            variant="outlined"
            className="pw-w-min pw-px-3 pw-text-sm !pw-outline-none !pw-py-0 !pw-leading-none pw-flex pw-items-center pw-justify-center"
          >
            {translate('shared>back')}
          </OffpixButtonBase>
        </div>
      </div>
    </div>
  );
};
