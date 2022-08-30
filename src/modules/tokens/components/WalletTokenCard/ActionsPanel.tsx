import classNames from 'classnames';

interface Props {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

interface Action {
  label: string;
  id: string;
  disabled: boolean;
  onClick: () => void;
}

export const WalletTokenCardActionsPanel = ({ isOpen, onClose }: Props) => {
  const actions: Array<Action> = [
    {
      id: 'Transferir',
      label: 'Transferir',
      disabled: false,
      onClick: () => {
        //
        onClose();
      },
    },
    {
      id: 'Certificado',
      label: 'Certificado',
      disabled: false,
      onClick: () => {
        //
        onClose();
      },
    },
  ];

  return (
    <>
      <div
        className={classNames(
          'pw-absolute pw-bg-white pw-py-4 pw-px-4 pw-rounded-[14px] pw-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] -pw-left-2 pw-bottom-[1px] pw-z-10 pw-transition-opacity pw-duration-200',
          isOpen ? 'pw-opacity-100' : 'pw-opacity-0'
        )}
      >
        <ul className="pw-flex pw-flex-col pw-divide-y-[0.5px] pw-divide-[#E4E4E4]">
          {actions.map(({ disabled, id, label, onClick }) => (
            <li key={id} className="pw-flex">
              <button
                type="button"
                disabled={disabled}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onClick();
                }}
                className={classNames(
                  'pw-font-semibold pw-text-[13px] pw-leading-[13px] pw-text-start pw-w-full pw-py-[7px] pw-rounded-md pw-px-1',
                  disabled
                    ? 'pw-text-[#777E8F]'
                    : 'pw-text-[#353945] hover:pw-bg-brand-primary hover:pw-bg-opacity-30'
                )}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
