import { ReactNode } from 'react';

import classNames from 'classnames';

import { ReactComponent as PixwayIconHorizontal } from '../../../shared/assets/icons/pixwayIconHorizontal.svg';

interface AuthLayoutBaseProps {
  children?: ReactNode;
  classes?: {
    root?: string;
    contentContainer?: string;
  };
  logo: string;
}

export const AuthLayoutBase = ({
  children,
  classes = {},
  logo,
}: AuthLayoutBaseProps) => {
  return (
    <div
      className={classNames(
        'pw-flex-1 pw-min-h-screen pw-w-full pw-pt-[32px] lg:pw-pt-[62px] pw-font-poppins',
        classes.root ?? '',
        logo
          ? 'pw-bg-black'
          : 'pw-bg-gradient-to-b pw-from-[rgba(74,74,74,99.79)] pw-to-[rgba(0,0,0,99.79)]'
      )}
    >
      <div
        className={classNames(
          'pw-max-w-[476px] pw-w-[calc(100%-28px)] pw-mx-auto pw-p-2 sm:pw-p-4 pw-bg-white pw-rounded-2xl',
          classes.contentContainer ?? ''
        )}
      >
        {logo ? (
          <div className="pw-flex pw-justify-center">
            <img
              src={logo}
              width={260}
              height={96}
              className="pw-mx-auto pw-object-contain"
              alt=""
            />
          </div>
        ) : (
          <PixwayIconHorizontal className="pw-w-[259px] pw-h-16 pw-fill-black pw-mx-auto" />
        )}

        {children}
      </div>
    </div>
  );
};
