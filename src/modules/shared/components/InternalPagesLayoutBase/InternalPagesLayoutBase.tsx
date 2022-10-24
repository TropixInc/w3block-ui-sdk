import { ReactNode } from 'react';

import classNames from 'classnames';

import { Menu } from '../Menu';

interface Props {
  classes?: {
    childrenContainer?: string;
    middleSectionContainer?: string;
  };
  children?: ReactNode;
}

export const InternalPagesLayoutBase = ({ classes = {}, children }: Props) => {
  return (
    <div className="pw-flex pw-flex-col pw-w-screen pw-font-poppins pw-container pw-mx-auto">
      <div
        className={classNames(
          'pw-flex pw-w-full pw-flex-1 pw-py-[59px]',
          classes.middleSectionContainer ?? ''
        )}
      >
        <div className="pw-w-[295px] pw-shrink-0 pw-hidden sm:pw-block">
          <Menu />
        </div>
        <div
          className={classNames(
            'sm:pw-pl-8 pw-w-full',
            classes.childrenContainer ?? ''
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
