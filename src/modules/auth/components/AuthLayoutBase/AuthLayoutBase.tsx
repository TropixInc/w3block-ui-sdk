import { ReactNode } from 'react';

import classNames from 'classnames';

import { ReactComponent as PixwayIconHorizontal } from '../../../shared/assets/icons/weblock_logo.svg';

interface AuthLayoutBaseProps {
  children?: ReactNode;
  logo: string;
  classes?: AuthLayoutBaseClasses;
  title: string;
}

export interface AuthLayoutBaseClasses {
  root?: string;
  contentContainer?: string;
  logoContainer?: string;
  logo?: string;
  title?: string;
}

export const AuthLayoutBase = ({
  children,
  classes = {},
  logo,
  title,
}: AuthLayoutBaseProps) => {
  const renderLogo = (width: number, height: number) => (
    <img
      src={logo}
      width={width}
      height={height}
      className={classNames(
        'pw-mx-auto pw-object-contain pw-w-20 pw-h-20 sm:pw-w-[140px] sm:pw-h-[140px]',
        classes.logo ?? ''
      )}
      alt=""
    />
  );

  const renderTitle = () =>
    title ? (
      <h1
        className={classNames(
          classes?.title ?? '',
          'pw-text-[#35394C] pw-font-bold pw-text-2xl pw-leading-[29px] pw-mt-6 pw-text-center'
        )}
      >
        {title}
      </h1>
    ) : null;

  return (
    <div
      className={classNames(
        'pw-flex-col pw-flex pw-flex-1 pw-min-h-screen pw-w-full pw-py-[46px] pw-pb-[22px] lg:pw-py-[40px] pw-px-[26.5px] lg:pw-px-[20px] pw-bg-[#F7F7F7] sm:pw-items-center sm:pw-justify-center pw-font-montserrat',
        classes.root ?? ''
      )}
    >
      <div className="sm:pw-hidden pw-pb-6">
        {renderLogo(80, 80)}
        {renderTitle()}
      </div>
      <div
        className={classNames(
          'pw-max-w-[514px] pw-w-full pw-mx-auto pw-pt-[35px] pw-pb-10 pw-px-[19px] sm:pw-py-[35px] sm:pw-px-[36.5px] pw-bg-white pw-rounded-2xl pw-shadow-[1px_1px_10px_rgba(0,0,0,0.2)]',
          classes.contentContainer ?? ''
        )}
      >
        <div className="pw-hidden sm:pw-block">
          {logo ? (
            <div
              className={classNames(
                classes.logoContainer ?? '',
                'pw-flex pw-justify-center'
              )}
            >
              {renderLogo(260, 96)}
            </div>
          ) : (
            <PixwayIconHorizontal className="pw-w-[259px] pw-h-16 pw-fill-black pw-mx-auto" />
          )}
          {renderTitle()}
        </div>

        {children}
      </div>
    </div>
  );
};
