import { useState } from 'react';

import classNames from 'classnames';

import ArrowDown from '../../assets/icons/arrowDown.svg?react';
import { ColumnsTable, Actions, FormatApiData } from '../../interface';
import { GenericButtonActions } from '../GenericButtonActions';
import SmartExpansibleLineContainer from './SmartExpansibleLineContainer/SmartExpansibleLineContainer';

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
}: LineProps) => {
  const [openExpansible, setOpenExpansible] = useState(false);

  return (
    <>
      <tr
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        key={(item as any).id}
        onClick={(e) => handleAction(e, lineActions?.action, item)}
        className={classNames(
          tableStyles?.line ?? '',
          'pw-px-3 pw-items-center pw-gap-x-1 pw-h-[72px] pw-border-t sm:pw-w-full ',
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
              <td key={key} className="pw-text-sm pw-text-left pw-px-3">
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
          <td className="pw-text-sm pw-text-left pw-px-3 ">
            <div className="pw-flex pw-items-center pw-gap-x-5">
              <GenericButtonActions dataItem={item} actions={actions ?? []} />
              <button
                onClick={() => setOpenExpansible(!openExpansible)}
                className="pw-cursor-pointer pw-w-5 pw-h-5"
              >
                <ArrowDown className="pw-stroke-brand-primary" />
              </button>
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
