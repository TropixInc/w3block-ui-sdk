import { ChangeEvent, ReactNode, useEffect, useRef } from 'react';
import { useClickAway } from 'react-use';

import classNames from 'classnames';

import SearchIcon from '../../assets/icons/searchOutlined.svg?react';
import useTranslation from '../../hooks/useTranslation';

export interface Option {
  label: string;
  value: string;
  icon?: ReactNode;
  disabled?: boolean;
}

interface SearchUserProps {
  search?: string;
  showResponseModal: boolean;
  onSearch: (value: string) => void;
  onShowResponseModal?: (open: boolean) => void;
  items: Array<Option>;
  inputPlaceholder: string;
  classes?: {
    modal?: string;
    root?: string;
    input?: string;
  };
  onSelectItemById?: (value: string) => void;
  isFilterDependency?: boolean;
  filters: any;
  dependenciesKeys?: Array<string>;
}

const GenericSearchFilter = ({
  search,
  items,
  showResponseModal,
  onSearch,
  onShowResponseModal,
  inputPlaceholder,
  classes,
  onSelectItemById,
  isFilterDependency,
  filters,
  dependenciesKeys,
}: SearchUserProps) => {
  const [translate] = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  const onShowModal = (show: boolean) => {
    onShowResponseModal && onShowResponseModal(show);
  };

  useEffect(
    () => (search ? onShowModal(true) : onShowModal(false)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search]
  );
  useClickAway(containerRef, () => {
    if (showResponseModal) onShowModal(false);
  });
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
    onShowModal(true);
    if (!e.target.value) {
      onSearch('');
      onShowModal(false);
    }
  };

  const handleItemSelected = (label: string, id: string) => {
    onShowModal(false);
    onSelectItemById && onSelectItemById(id);
    onSearch(label);
  };

  const onDisabledInput = () => {
    if (filters && dependenciesKeys) {
      return dependenciesKeys.every((key) => {
        // eslint-disable-next-line no-prototype-builtins
        return filters.hasOwnProperty(key);
      });
    }
  };

  const renderResponseItems = () => {
    return showResponseModal ? (
      <div
        className="pw-absolute pw-bg-white pw-z-50 pw-w-full pw-mt-1 pw-border pw-border-[#B9D1F3] pw-rounded-lg pw-p-[14px]"
        ref={containerRef}
      >
        {items?.length > 0 ? (
          <ul className="pw-flex pw-flex-col pw-gap-y-3 pw-max-h-[220px] pw-overflow-y-auto">
            {items.map((item) => (
              <li
                className="hover:pw-bg-[#B9D1F3] pw-rounded-lg pw-p-2 pw-cursor-pointer"
                key={item.value}
              >
                <button
                  onClick={() =>
                    handleItemSelected(
                      (item?.label as string) || '',
                      item?.value
                    )
                  }
                >
                  <div className="pw-flex pw-gap-x-4 pw-items-center">
                    <p className="pw-flex pw-flex-col">
                      <span className="pw-text-sm pw-text-left">
                        {item.label}
                      </span>
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="pw-text-center">{translate('token>pass>notResult')}</p>
        )}
      </div>
    ) : null;
  };

  return (
    <div className={classNames('pw-relative pw-w-full', classes?.root)}>
      <div className="pw-flex pw-w-full pw-items-center pw-h-[46px] pw-gap-x-2 pw-bg-white pw-border pw-border-slate-300 pw-pl-4 pw-pr-1 pw-rounded-lg">
        <SearchIcon className="pw-stroke-slate-500" />
        <input
          type="text"
          placeholder={inputPlaceholder}
          value={search}
          disabled={isFilterDependency && !onDisabledInput()}
          onChange={(e) => handleSearchChange(e)}
          className={classNames(
            'pw-text-[15px] pw-text-slate-300 placeholder:pw-text-slate-300 pw-w-full focus:pw-outline-none disabled:pw-opacity-30',
            classes?.input ?? ''
          )}
        />
      </div>
      {renderResponseItems()}
    </div>
  );
};

export default GenericSearchFilter;
