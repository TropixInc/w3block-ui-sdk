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
    <div className="pw-flex pw-flex-col sm:pw-w-screen pw-min-h-screen pw-font-poppins">
      <div
        className={classNames(
          'pw-flex pw-max-w-[1332px] pw-w-full pw-mx-auto pw-flex-1 pw-pt-[59px] pw-px-4 sm:pw-px-8',
          classes.middleSectionContainer ?? ''
        )}
      >
        <div className="pw-w-[295px] pw-shrink-0 pw-hidden sm:pw-block">
          <Menu />
        </div>
        <div className="pw-flex pw-flex-col pw-w-full">
          <div
            className={classNames(
              'pw-flex-1 sm:pw-pl-8',
              classes.childrenContainer ?? ''
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
