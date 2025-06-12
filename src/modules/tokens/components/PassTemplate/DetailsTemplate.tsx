import { ReactNode } from 'react';
import { useToggle } from 'react-use';

import classNames from 'classnames';

import ChevronDown from '../../../shared/assets/icons/chevronDownOutlined.svg';

interface Props {
  title: string;
  children: ReactNode;
  autoExpand?: boolean;
  childrenClass?: string;
  className?: string;
}

export const DetailsTemplate = ({
  title,
  children,
  autoExpand = false,
  childrenClass = '',
  className,
}: Props) => {
  const [isOpen, toggleOpen] = useToggle(autoExpand);
  return (
    <div
      className={classNames(
        'pw-w-full pw-flex pw-flex-col pw-justify-center pw-items-start pw-py-[11px] pw-gap-[30px]',
        className
      )}
    >
      <div
        className="pw-text-[#295BA6] pw-font-medium pw-text-[12px] pw-leading-[18px] pw-flex pw-gap-[10px] pw-cursor-pointer"
        onClick={toggleOpen}
      >
        <ChevronDown
          className={classNames(
            'pw-stroke-[#295BA6]',
            isOpen ? 'pw-rotate-180' : ''
          )}
        />
        {title}
      </div>
      <div
        className={classNames(
          isOpen ? '' : 'pw-hidden',
          childrenClass,
          'pw-flex pw-flex-col pw-gap-[30px] pw-w-full'
        )}
      >
        {children}
      </div>
    </div>
  );
};
