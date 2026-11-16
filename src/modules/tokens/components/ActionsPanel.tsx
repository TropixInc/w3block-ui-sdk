import { useContext } from 'react';

import { Popover } from '@mui/material';
import { TokenActionsContext } from '../contexts/TokenActionsContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}

export const WalletTokenCardActionsPanel = ({
  isOpen,
  onClose: onClosePanel,
  anchorEl,
}: Props) => {
  const actions = useContext(TokenActionsContext);

  return (
    <Popover
      open={isOpen}
      anchorEl={anchorEl}
      onClose={onClosePanel}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: '14px',
            padding: '8px',
            boxShadow: '0px 4px 4px rgba(0,0,0,0.25)',
            minWidth: '150px',
          },
        },
      }}
    >
      <ul className="pw-flex pw-flex-col pw-divide-y-[0.5px] pw-divide-[#E4E4E4]">
        {actions
          .filter(({ disabled }) => !disabled)
          .map(({ disabled, id, label, onClick }) => (
            <li key={id} className="pw-flex">
              <button
                type="button"
                disabled={disabled}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onClosePanel();
                  onClick();
                }}
                className={`pw-font-semibold pw-text-[13px] pw-leading-[13px] pw-text-start pw-w-full pw-py-[7px] pw-rounded-md pw-px-1 ${
                  disabled
                    ? 'pw-text-[#777E8F]'
                    : 'pw-text-[#353945] hover:pw-bg-brand-primary hover:pw-bg-opacity-30'
                }`}
              >
                {label}
              </button>
            </li>
          ))}
      </ul>
    </Popover>
  );
};
