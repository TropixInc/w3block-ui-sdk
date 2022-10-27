import classNames from 'classnames';

import W3blockLogoWhite from '../../assets/icons/w3block_logo_white.svg';
import W3blockLogo from '../../assets/icons/weblock_logo.svg';
import { position } from '../../enums';
interface Classes {
  container?: string;
  title?: string;
  image?: string;
}

interface Props {
  redirectLink?: string;
  imageSrc?: string;
  classes?: Classes;
  logoColor?: 'black' | 'white';
  PwPosition?: position;
}

export const PoweredBy = ({
  redirectLink = 'https://w3block.io',
  imageSrc = W3blockLogo,
  classes,
  logoColor = 'black',
  PwPosition = position.CENTER,
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
        'pw-flex pw-items-center pw-justify-center pw-py-6 pw-container pw-mx-auto',
        positionPowered
      )}
    >
      <p
        className={classNames(
          classes?.title,
          'pw-text-center pw-font-roboto pw-text-xs pw-mr-1'
        )}
      >
        Powered by
      </p>
      <a href={redirectLink} target="_blank" rel="noreferrer">
        <img
          className={classNames(
            classes?.image,
            'pw-max-w-[100px] pw-w-full pw-object-contain pw-max-h-[20px]'
          )}
          src={logoColor === 'black' ? imageSrc : W3blockLogoWhite}
          alt="logo"
        />
      </a>
    </div>
  );
};
