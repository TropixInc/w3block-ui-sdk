import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useToggle } from 'react-use';

import classNames from 'classnames';

import { ReactComponent as FilterIcon } from '../../../shared/assets/icons/filterOutlined.svg';
import useTranslation from '../../../shared/hooks/useTranslation';

export interface ValidStatusProps {
  key: string;
  statusColor: string;
}

export const Filters = ({
  setSearchTerm,
  setStatus,
  status,
  totalItens,
  validStatus,
}: {
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setStatus: (e: string) => void;
  status: string[];
  totalItens?: number;
  validStatus: ValidStatusProps[];
}) => {
  const [translate] = useTranslation();
  const [showFilter, setShowFilter] = useToggle(false);
  return (
    <div className="pw-flex pw-flex-col pw-gap-4">
      <div className="pw-w-full pw-flex">
        <input
          type="text"
          placeholder="Busca por ID, Nome..."
          className="pw-border pw-border-[#295BA6] pw-rounded-[8px] pw-p-[10px] pw-text-[13px] pw-leading-[19.5px] pw-text-[#353945] pw-w-full pw-max-w-[270px] sm:pw-max-w-[431px]"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
        />
        <div
          className={classNames(
            'pw-flex pw-justify-center pw-items-center pw-w-10 pw-h-10 pw-rounded-full pw-border pw-border-[#295BA6] pw-ml-4 pw-cursor-pointer ',
            showFilter ? 'pw-bg-[#295BA6]' : 'pw-bg-[#EFEFEF]'
          )}
          onClick={() => setShowFilter()}
        >
          <FilterIcon
            className={classNames(
              showFilter ? 'pw-stroke-[#EFEFEF]' : 'pw-stroke-[#295BA6]'
            )}
          />
        </div>
      </div>
      {showFilter ? (
        <>
          <div className="pw-flex pw-flex-col pw-gap-2 pw-text-[#777E8F] pw-text-[14px] pw-leading-[21px] pw-font-semibold">
            <div>{translate('token>pass>status')}</div>
            <div className="pw-flex pw-gap-2">
              {validStatus.map(({ key, statusColor }) => {
                const isChecked = status.find(
                  (e) => e.toLocaleLowerCase() === key.toLocaleLowerCase()
                );

                return (
                  <div
                    key={key}
                    className={classNames(
                      'pw-flex pw-gap-2 pw-items-center pw-justify-center pw-cursor-pointer',
                      isChecked ? 'pw-text-[#777E8F]' : 'pw-text-[#DCDCDC]'
                    )}
                    onClick={() => setStatus(key.toLowerCase())}
                  >
                    {isChecked ? (
                      <div className="pw-relative pw-h-[12.75px] pw-w-[12.75px] pw-border-[1.4px] pw-border-[#295BA6] pw-rounded-sm">
                        <div className="pw-absolute pw-w-[5px] pw-h-[10px] pw-border-t-[1.4px] pw-border-l-[1.4px] pw-border-[#295BA6] pw-rotate-[220deg] -pw-top-[40%] pw-left-[50%] pw-bg-white pw-shadow-[0px_1px_1px_rgb(255, 255, 255,1)]" />
                      </div>
                    ) : (
                      <div className="pw-h-[12.75px] pw-w-[12.75px] pw-border pw-border-[#295BA6] pw-rounded-sm" />
                    )}
                    <div
                      className={classNames(
                        'pw-rounded-full pw-w-[6px] pw-h-[6px]',
                        `pw-bg-[${statusColor}]`
                      )}
                    />

                    {key}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pw-text-[#777E8F] pw-text-[14px] pw-leading-[21px] pw-font-normal">
            {translate('token>pass>total', { total: totalItens })}
          </div>
        </>
      ) : null}
    </div>
  );
};
