import { ReactNode } from 'react';

interface Props {
  arrowPosition?: 'left' | 'top' | 'right' | 'bottom';
  className?: string;
  children?: ReactNode;
  visible: boolean;
  classes?: {
    content?: string;
    arrow?: string;
  };
}

const positionedArrowClassNamesMap = new Map([
  [
    'left',
    'after:pw-left-0 after:pw-top-1/2 after:pw-border-[transparent_#DFEAFA_transparent_transparent]',
  ],
  [
    'right',
    'after:pw-right-0 after:pw-top-1/2 after:pw-border-[transparent_transparent_transparent_#DFEAFA',
  ],
  [
    'top',
    'after:pw-left-[12px] after:pw-top-[-16px] after:pw-border-[transparent_transparent_#DFEAFA_transparent]',
  ],
  [
    'bottom',
    'after:pw-left-[12px] after:-pw-bottom-[16px] after:pw-border-[#DFEAFA_transparent_transparent_transparent]',
  ],
]);

export const Tooltip = ({
  arrowPosition,
  children,
  className = '',
  visible,
  classes = {},
}: Props) => {
  const arrowClassNames = arrowPosition
    ? `after:pw-absolute after:pw-block  after:pw-content-[''] after:pw-border-[8px] after:-pw-ml-2 
    ${positionedArrowClassNamesMap.get(arrowPosition)} ${classes.arrow || ''}`
    : '';

  return (
    <div
      className={`${className} ${visible ? 'pw-block' : 'pw-hidden'} 
      after:pw-absolute after:pw-block after:pw-w-[50px] after:pw-h-10 after:pw-top-[55px] -pw-z-1`}
    >
      <div
        className={`pw-relative pw-rounded-lg pw-px-3 pw-py-2 pw-text-xs pw-text-left pw-font-bold pw-leading-[14px] pw-text-[#333333] pw-bg-[#DFEAFA] 
        ${arrowClassNames} after:pw-drop-shadow-[1px_0_0_#e6e8ec] pw-w-[176px] pw-z-20 
        ${classes.content || ''}`}
      >
        {children}
      </div>
    </div>
  );
};
