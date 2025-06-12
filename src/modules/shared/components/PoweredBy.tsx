/* eslint-disable i18next/no-literal-string */
import classNames from 'classnames';

import W3blockLogoWhite from '../assets/icons/w3block_logo_white.svg';
import W3blockLogo from '../assets/icons/weblock_logo.svg';
import { position } from '../enums/styleConfigs';

interface Classes {
  container?: string;
  title?: string;
  image?: string;
}

export interface ExtraBy {
  title: string;
  logoSrc: string;
}

interface Props {
  redirectLink?: string;
  imageSrc?: string;
  classes?: Classes;
  logoColor?: 'black' | 'white';
  PwPosition?: position;
  extraBy?: ExtraBy[];
}

export const PoweredBy = ({
  redirectLink = 'https://w3block.io',
  imageSrc = W3blockLogo,
  classes,
  logoColor = 'black',
  PwPosition = position.CENTER,
  extraBy,
}: Props) => {
  const positionPowered =
    PwPosition == position.CENTER
      ? 'sm:pw-justify-center'
      : PwPosition === position.RIGHT
      ? 'sm:pw-justify-end'
      : 'sm:pw-justify-start';

  return (
    <div
      className={classNames(
        classes?.container,
        'pw-flex sm:pw-flex-row pw-flex-col  pw-items-center pw-justify-center pw-gap-x-6 pw-py-6 pw-container pw-mx-auto',
        positionPowered
      )}
    >
      {extraBy
        ? extraBy?.map(({ title, logoSrc }) => (
            <div
              key={title}
              className="pw-flex pw-justify-center pw-items-center"
            >
              <p
                className={classNames(
                  classes?.title,
                  'pw-text-center pw-text-xs pw-font-poppins pw-whitespace-nowrap pw-mr-2'
                )}
              >
                {title}
              </p>
              <img
                className={classNames(
                  classes?.image,
                  'pw-max-w-[100px] pw-w-full pw-h-full pw-object-contain'
                )}
                src={logoSrc ?? ''}
                alt="logo"
              />
            </div>
          ))
        : null}
      <div className="pw-flex pw-justify-center pw-items-center">
        <p
          className={classNames(
            classes?.title,
            'pw-text-center pw-text-xs pw-mr-2 pw-font-poppins'
          )}
        >
          powered by
        </p>
        <a href={redirectLink} target="_blank" rel="noreferrer">
          <img
            className={classNames(
              classes?.image,
              'pw-max-w-[100px] pw-w-full pw-object-contain pw-max-h-[20px]'
            )}
            src={(logoColor === 'black' ? imageSrc : W3blockLogoWhite) ?? ""}
            alt="logo"
          />
        </a>
      </div>
    </div>
  );
};
