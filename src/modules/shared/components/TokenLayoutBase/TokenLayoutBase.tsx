import { ReactNode } from 'react';

import classNames from 'classnames';

import { HeaderPixwaySDK } from '../HeaderPixwaySDK';
import { Menu } from '../Menu';
import { W3blockFooter } from '../W3blockFooter';

interface Props {
  classes?: {
    childrenContainer?: string;
    middleSectionContainer?: string;
  };
  children?: ReactNode;
}

export const TokenLayoutBase = ({ classes = {}, children }: Props) => {
  return (
    <div className="pw-flex pw-flex-col pw-w-screen pw-min-h-screen pw-font-poppins">
      <HeaderPixwaySDK />
      <div
        className={classNames(
          'pw-flex pw-max-w-[1332px] pw-w-full pw-mx-auto pw-flex-1 pw-pt-[59px] pw-px-8',
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
      <W3blockFooter />
    </div>
  );
};
