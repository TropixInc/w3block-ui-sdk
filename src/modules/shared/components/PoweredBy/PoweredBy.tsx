import classNames from 'classnames';

import W3blockLogo from '../../assets/icons/weblock_logo.svg';

interface Classes {
  container?: string;
  title?: string;
  image?: string;
}

interface Props {
  redirectLink?: string;
  imageSrc?: string;
  classes?: Classes;
}

export const PoweredBy = ({
  redirectLink = 'https://w3block.io',
  imageSrc = W3blockLogo,
  classes,
}: Props) => {
  return (
    <div
      className={classNames(
        classes?.container,
        'pw-flex pw-items-center pw-justify-center pw-mt-10'
      )}
    >
      <p
        className={classNames(
          classes?.title,
          'pw-text-center pw-font-roboto pw-text-xs pw-mr-2'
        )}
      >
        Powered by
      </p>
      <a href={redirectLink} target="_blank" rel="noreferrer">
        <img
          className={classNames(classes?.image, 'pw-w-[100px] pw-h-[20px]')}
          src={imageSrc}
          alt="logo"
        />
      </a>
    </div>
  );
};
