import { useState } from 'react';

import classNames from 'classnames';

import ArrowDown from '../assets/icons/arrowDown.svg';
import { ColumnsTable, Actions, FormatApiData } from '../interfaces/ConfigGenericTable';
import { GenericButtonActions } from './GenericButtonActions';
import SmartExpansibleLineContainer from './SmartExpansibleLineContainer';


interface LineProps {
  item: any;
  columns: Array<ColumnsTable>;
  lineActions?: Actions;
  tableStyles: any;
  actions?: Array<Actions>;
  isLineExplansible?: boolean;
  expansibleComponent?: any;
  handleAction: (event: any, action: any, row: any) => void;
  handleCalcColumnSpan: () => number;
  customizerValues: (
    item: any,
    itemKey: string,
    format: FormatApiData,
    basicUrl?: string,
    keyInCollection?: string,
    moreInfos?: any,
    hrefLink?: string,
    linkLabel?: string,
    isTranslatable?: boolean,
    translatePrefix?: string,
    isDynamic?: boolean
  ) => any;

  setIsUpdateList?: (value: boolean) => void;
  variant?: 'default' | 'redesign';
}

const Line = ({
  columns,
  item,
  lineActions,
  tableStyles,
  actions,
  isLineExplansible,
  expansibleComponent,
  handleAction,
  handleCalcColumnSpan,
  customizerValues,
  setIsUpdateList,
  variant = 'default',
}: LineProps) => {
  const [openExpansible, setOpenExpansible] = useState(false);
  const isV2 = variant === 'redesign';

  return (
    <>
      <tr
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        key={(item as any).id}
        className={classNames(
          tableStyles?.line ?? '',
          'pw-px-3 pw-items-center pw-gap-x-1 pw-border-t sm:pw-w-full',
          isV2
            ? 'pw-border-[#e6e8ec] pw-text-[#4a5567] hover:pw-bg-[#fbfcfd]'
            : 'pw-h-[72px]',
          lineActions ? 'pw-cursor-pointer' : 'pw-cursor-default'
        )}
      >
        {columns
          .filter(({ header }) => header.label)
          .map(
            ({
              key,
              format,
              header,
              keyInCollection,
              moreInfos,
              hrefLink,
              linkLabel,
              isTranslatable,
              translatePrefix,
              isDynamicValue,
              columnStyles,
            }) => (
              <td
                key={key}
                className={classNames(
                  'pw-text-sm pw-text-left pw-px-3',
                  isV2 ? 'pw-py-3' : ''
                )}
                onClick={(e) => handleAction(e, lineActions?.action, item)}
              >
                <div className={classNames(columnStyles, '')}>
                  {customizerValues(
                    item as any,
                    key,
                    format,
                    header.baseUrl,
                    keyInCollection,
                    moreInfos,
                    hrefLink,
                    linkLabel,
                    isTranslatable,
                    translatePrefix,
                    isDynamicValue
                  )}
                </div>
              </td>
            )
          )}
        {actions || isLineExplansible ? (
          <td className="pw-text-sm pw-text-left pw-px-3">
            <div className="pw-flex pw-items-center pw-gap-x-5">
              {actions ? (
                <GenericButtonActions dataItem={item} actions={actions ?? []} />
              ) : null}
              {isLineExplansible ? (
                <button
                  onClick={() => setOpenExpansible(!openExpansible)}
                  className="pw-cursor-pointer pw-w-5 pw-h-5"
                >
                  <ArrowDown className="pw-stroke-brand-primary" />
                </button>
              ) : null}
            </div>
          </td>
        ) : null}
      </tr>
      {isLineExplansible && openExpansible && expansibleComponent ? (
        <tr>
          <td colSpan={handleCalcColumnSpan()}>
            {' '}
            <SmartExpansibleLineContainer
              expansibleComponent={expansibleComponent}
              rowData={item}
              setOpenExpansible={setOpenExpansible}
              setIsUpdateList={setIsUpdateList}
            />
          </td>
        </tr>
      ) : null}
    </>
  );
};

export default Line;
