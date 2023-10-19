import { lazy } from 'react';

import classNames from 'classnames';

import { useModalController } from '../../hooks/useModalController';
const Tooltip = lazy(() =>
  import('../Tooltip/Tooltip').then((module) => ({
    default: module.Tooltip,
  }))
);

interface Props {
  children: React.ReactNode;
  content: React.ReactNode | string;
  classes?: {
    content?: string;
    arrow?: string;
  };
  position?: 'top' | 'bottom';
}

export const TooltipHover = ({
  children,
  content,
  classes,
  position = 'top',
}: Props) => {
  const { isOpen, closeModal, openModal } = useModalController();
  const stylePosition =
    position === 'top'
      ? '!pw-absolute !pw-bottom-[30px] !pw-left-0'
      : '!pw-absolute !pw-top-[calc(100%_+_15px)] !pw-left-0';

  return (
    <div
      className="pw-relative  pw-w-fit pw-max-w-full"
      onMouseLeave={closeModal}
      onMouseEnter={openModal}
    >
      {children}

      <Tooltip
        visible={isOpen}
        className={classNames('after:!pw-h-0', stylePosition)}
        arrowPosition={position === 'top' ? 'bottom' : 'top'}
        classes={{
          content: classNames(
            '!pw-bg-white pw-border pw-border-[#ECF0F8] !pw-font-normal !pw-w-fit !pw-min-w-[200px] !pw-px-0',
            classes?.content ?? ''
          ),

          arrow: classNames(
            position === 'top'
              ? 'after:pw-border-[#FFFFFF_transparent_transparent_transparent] after:!-pw-bottom-[16px]'
              : 'after:pw-border-[transparent_transparent_#FFFFFF_transparent] after:!pw-top-[-16px]',
            classes?.arrow ?? ''
          ),
        }}
      >
        <div className="pw-font-semibold pw-max-h-[150px] pw-overflow-auto pw-px-3">
          {content}
          <div
            className={classNames(
              'pw-w-full pw-h-4 pw-absolute pw-left-0 pw-bg-transparent',
              position === 'top' ? 'pw-bottom-[-16px]' : 'pw-top-[-16px]'
            )}
          ></div>
        </div>
      </Tooltip>
    </div>
  );
};
