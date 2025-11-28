import { useMemo, useState, useRef } from 'react';
import { Popover } from '@mui/material';

import _ from 'lodash';

import Dots from '../assets/icons/dotsVerficalFilled.svg';
import { useRouterConnect } from '../hooks/useRouterConnect';


interface ButtonProps {
  dataItem: any;
  actions: any[];
}

export const GenericButtonActions = ({ dataItem, actions }: ButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const router = useRouterConnect();
  const renderOptions = useMemo(() => {
    return actions.filter((item) =>
      item.conditions ? item.conditions(dataItem) : true
    );
  }, [actions, dataItem]);

  const handleAction = (event: any, action: any) => {
    if (action && action.type == 'function') {
      event?.preventDefault();
      action.data(dataItem);
    } else if (action && action.type == 'navigate') {
      getHref(action, dataItem);
    }
    handleClose();
  };

  const getHref = (action: any, row: any) => {
    if (action && action.type == 'navigate') {
      let url = action.data;

      if (action.replacedQuery) {
        action.replacedQuery.forEach(
          (item: string) => (url = url.replace(`{${item}}`, _.get(row, item)))
        );

        router.pushConnect(url ?? '');
      }
    } else if (action && action.type == 'function') {
      return '';
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return renderOptions.length ? (
    <>
      <button
        className="pw-border pw-border-[#9cc2f7] pw-w-8 pw-h-8 pw-flex pw-items-center pw-justify-center pw-rounded-md hover:pw-bg-blue1 hover:pw-fill-[#9cc2f7]"
        onClick={handleClick}
      >
        <Dots className="pw-w-4 pw-h-3" />
      </button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '8px',
              border: '1px solid #9cc2f7',
              width: '200px',
              overflow: 'hidden',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            },
          },
        }}
      >
        <div className="pw-bg-white">
          {renderOptions.map((item, index) => (
            <a
              key={item.label + index}
              onClick={(e) => handleAction(e, item.action)}
              className="pw-w-full pw-block pw-text-sm pw-text-left pw-p-3 hover:pw-bg-[#9cc2f7] pw-cursor-pointer"
            >
              {item.label}
            </a>
          ))}
        </div>
      </Popover>
    </>
  ) : null;
};
