/* eslint-disable react/jsx-key */
import React from 'react';

import classNames from 'classnames';

import { ReactComponent as FacebookIcon } from '../../shared/assets/icons/facebook.svg';
import { ReactComponent as InstagramIcon } from '../../shared/assets/icons/instagramFilled.svg';
import { ReactComponent as MessageIcon } from '../../shared/assets/icons/message.svg';
import { ReactComponent as TwitterIcon } from '../../shared/assets/icons/twitter.svg';
import { Link } from '../../shared/components/Link';
import { FooterData, FooterDefault } from '../interfaces';
export const Footer = ({
  data,
  defaultData,
}: {
  data: FooterData;
  defaultData: FooterDefault;
}) => {
  const backgroundColor = data.bgColor || defaultData.bgColor;
  const color = data.textColor || defaultData.textColor;

  const socialNetWorkLinkSharedClassnames =
    'pw-fill-[#090909] hover:pw-fill-brand-primary pw-w-4 pw-h-4 pw-p-2';

  const typeToIcon = new Map([
    [
      'facebook',
      // eslint-disable-next-line react/jsx-key
      <FacebookIcon
        className={socialNetWorkLinkSharedClassnames}
        style={{ fill: color, background: '#090909', borderRadius: '50%' }}
      />,
    ],
    [
      'twitter',
      <TwitterIcon
        className={socialNetWorkLinkSharedClassnames}
        style={{
          fill: socialNetWorkLinkSharedClassnames,
          borderRadius: '50%',
          background: '#090909',
        }}
      />,
    ],
    ['instagram', <InstagramIcon />],
    [
      'whatsapp',
      <MessageIcon
        className={socialNetWorkLinkSharedClassnames}
        style={{
          fill: socialNetWorkLinkSharedClassnames,
          borderRadius: '50%',
          background: '#090909',
        }}
      />,
    ],
  ]);

  return (
    <>
      <div
        style={{ backgroundColor: backgroundColor }}
        className="pw-w-full pw-font-poppins pw-flex-col pw-shadow-[0px_-4px_16px_rgba(0,0,0,0.15)] pw-flex pw-justify-center pw-items-center pw-relative "
      >
        <div className="pw-flex pw-py-[22px] sm:pw-py-10 pw-flex-col pw-gap-[15px] sm:pw-gap-4 pw-justify-center pw-items-center pw-max-w-[1440px] pw-w-full">
          <div className="pw-w-full pw-font-semibold pw-text-sm pw-leading-[17px] pw-gap-[7px] sm:pw-gap-[54px] pw-flex pw-items-center pw-justify-center pw-flex-col sm:pw-flex-row">
            {data.links?.map(({ label, value }) => (
              <a
                href={value}
                key={value}
                style={{ color: color, textDecoration: 'none' }}
              >
                {label}
              </a>
            ))}
          </div>
          <div className="pw-w-[304px] sm:pw-w-full pw-bg-[#090909] sm:pw-bg-[#E4E4E4] pw-h-[1px]" />
          <div
            style={{ color: color }}
            className="pw-flex pw-items-center pw-gap-1 pw-font-normal pw-text-sm pw-leading-[15px] pw-text-center sm:pw-mx-20 md:pw-mx-28"
          >
            <p className="pw-text-center">{data.description}</p>
          </div>
          <div className="pw-w-full pw-flex pw-gap-4 pw-justify-center">
            {data.defaultSocialNetworks?.map(({ type, id, url }) => (
              <Link
                key={id}
                href={url}
                target="_blank"
                className={classNames(
                  socialNetWorkLinkSharedClassnames,
                  color,
                  'pw-w-8 pw-h-8'
                )}
              >
                {typeToIcon.get(type)}
              </Link>
            ))}
          </div>{' '}
        </div>
        <div
          style={{ background: '#DDE6F3' }}
          className="pw-flex pw-items-center pw-justify-between pw-w-full pw-text-left pw-h-[171px] pw-p-4"
        >
          <span className="pw-flex pw-p-4">
            <p className="pw-text-lg">
              Nós utilizamos cookies e outras tecnologias semelhantes para
              coletar dados durante a navegação para melhorar a sua experiência
              em nossos serviços. Saiba mais em nossa{' '}
              <Link href="/"> Política de privacidade.</Link>
            </p>
          </span>
          <span className='className="pw-flex pw-p-4"'>
            <button
              style={{ background: backgroundColor, color: color }}
              className="pw-border-none pw-h-[32px] pw-w-[70px] pw-rounded-md "
            >
              Estou ciente
            </button>
          </span>
        </div>
        <div
          style={{ background: '#fff' }}
          className="pw-flex pw-w-full pw-text-left pw-justify-center pw-items-center pw-h-[42px]"
        >
          Copyright 2022 - [web/lock]
        </div>
      </div>
    </>
  );
};
