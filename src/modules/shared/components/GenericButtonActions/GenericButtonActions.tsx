import { useMemo, useState } from 'react';
import { Popover } from 'react-tiny-popover';

import _ from 'lodash';
import { useRouter } from 'next/router';

import Dots from '../../assets/icons/dotsVerficalFilled.svg?react';

interface ButtonProps {
  dataItem: any;
  actions: any[];
}

export const GenericButtonActions = ({ dataItem, actions }: ButtonProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const renderOptions = useMemo(() => {
    return actions.filter((item) =>
      item.conditions ? item.conditions(dataItem) : true
    );
  }, [actions, dataItem]);

  const handleAction = (action: any) => {
    if (action && action.type == 'navigate') {
      let url = action.data;
      if (action.replacedQuery) {
        action.replacedQuery.forEach(
          (item: string) =>
            (url = url.replace(`{${item}}`, _.get(dataItem, item)))
        );

        router.push(url);
      }
    } else if (action && action.type == 'function') {
      action.data(dataItem);
    }
  };

  return renderOptions.length ? (
    <Popover
      isOpen={isMenuOpen}
      positions={['right', 'left']}
      padding={10}
      reposition
      onClickOutside={() => setIsMenuOpen(false)}
      content={() => (
        <div className="pw-border pw-border-[#9cc2f7] pw-w-[200px] pw-bg-white pw-rounded-lg pw-overflow-hidden">
          {renderOptions.map((item, index) => (
            <button
              key={item.label + index}
              onClick={() => handleAction(item.action)}
              className="pw-w-full pw-text-sm pw-text-left pw-p-3 hover:pw-bg-[#9cc2f7]"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    >
      <button
        className="pw-border pw-border-[#9cc2f7] pw-w-8 pw-h-8 pw-flex pw-items-center pw-justify-center pw-rounded-md hover:pw-bg-blue1 hover:pw-fill-white"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <Dots className="pw-w-4 pw-h-3" />
      </button>
    </Popover>
  ) : null;
};
