import { ReactNode } from 'react';

import classNames from 'classnames';

import { ReactComponent as ComercialIcon } from '../../assets/icons/comercial.svg';
import { ReactComponent as FacebookIcon } from '../../assets/icons/facebookFilled.svg';
import { ReactComponent as LinkedinIcon } from '../../assets/icons/linkedinFilled.svg';
import { ReactComponent as LinkIcon } from '../../assets/icons/linkFilled.svg';
import { ReactComponent as TwitterIcon } from '../../assets/icons/twitterFilled.svg';
import { ReactComponent as WhatsappIcon } from '../../assets/icons/whatsappFilled.svg';
import LogoW3block from '../../assets/images/logo_w3block.png';
import { ExternalRoutes } from '../../enums/ExternalRoutes';
import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../hooks/useCompanyConfig';
import useTranslation from '../../hooks/useTranslation';
import { Link } from '../Link';
import TranslatableComponent from '../TranslatableComponent';

interface SocialNetwork {
  id: string;
  url: string;
  icon: string | ReactNode;
  className?: string;
}

interface Url {
  path: string;
  label: string;
  className?: string;
}

interface W3blockFooterProps {
  socialNetworks?: Array<SocialNetwork>;
  links?: Array<Url>;
}

const socialNetWorkLinkSharedClassnames =
  'pw-fill-[#090909] hover:pw-fill-brand-primary pw-w-8 pw-h-8';

const defaultSocialNetworks: Array<SocialNetwork> = [
  {
    id: 'facebook',
    url: ExternalRoutes.FACEBOOK,
    icon: <FacebookIcon className={socialNetWorkLinkSharedClassnames} />,
    className: 'footer-link-facebook',
  },
  {
    id: 'twitter',
    url: ExternalRoutes.TWITTER,
    icon: <TwitterIcon className={socialNetWorkLinkSharedClassnames} />,
    className: 'footer-link-twitter',
  },
  {
    id: 'whatsapp',
    url: ExternalRoutes.WHATSAPP,
    icon: <WhatsappIcon className={socialNetWorkLinkSharedClassnames} />,
    className: 'footer-link-whatsapp',
  },
  {
    id: 'linkedin',
    url: ExternalRoutes.LINKEDIN,
    icon: <LinkedinIcon className={socialNetWorkLinkSharedClassnames} />,
    className: 'footer-link-linkedin',
  },
  {
    id: 'link',
    url: ExternalRoutes.LINK,
    icon: <LinkIcon className={socialNetWorkLinkSharedClassnames} />,
    className: 'footer-link',
  },
];

const _W3blockFooter = ({
  socialNetworks = defaultSocialNetworks,
  links,
}: W3blockFooterProps) => {
  const [translate] = useTranslation();
  const { logoUrl } = useCompanyConfig();

  const defaultLinks: Array<Url> = [
    {
      label: translate('home>footer>privacyPolicy'),
      path: PixwayAppRoutes.PRIVACY_POLICY,
      className: 'footer-link-privacypolicy',
    },
    {
      path: PixwayAppRoutes.TERMS_CONDITIONS,
      label: translate('home>footer>termsConditions'),
      className: 'footer-link-termsconditions',
    },
    {
      path: PixwayAppRoutes.FAQ,
      label: translate('home>footer>faq'),
      className: 'footer-link-faq',
    },
    {
      path: PixwayAppRoutes.CONTACT_US,
      label: translate('home>footer>contactUs'),
      className: 'footer-link-contactus',
    },
  ];

  return (
    <div className="pw-w-full pw-bg-white pw-shadow-[0px_-4px_16px_rgba(0,0,0,0.15)] pw-flex pw-justify-center pw-relative ">
      <div className="pw-flex pw-py-[22px] sm:pw-py-4 pw-flex-col pw-gap-[15px] sm:pw-gap-4 pw-justify-center pw-items-center pw-max-w-[1440px] pw-w-full pw-text-[#090909]">
        <div className="pw-w-full pw-font-semibold pw-text-sm pw-leading-[17px] pw-gap-[7px] sm:pw-gap-[54px] pw-flex pw-items-center pw-justify-center pw-flex-col sm:pw-flex-row">
          <Link href={PixwayAppRoutes.HOME} className="footer-link-logo">
            <img src={logoUrl} alt="logo" className="footer-logo-image" />
          </Link>
          {(links ?? defaultLinks).map(({ label, path, className }) => (
            <Link href={path} className={className} key={path}>
              {label}
            </Link>
          ))}
        </div>
        <div className="pw-w-[304px] sm:pw-w-full pw-bg-[#090909] sm:pw-bg-[#E4E4E4] pw-h-[1px]" />
        <div className="pw-max-w-[335px] sm:pw-max-w-[725px] pw-w-full pw-text-[13px] pw-leading-4s pw-text-center">
          {translate('home>footer>text')}
        </div>

        <div className="pw-w-full pw-flex pw-gap-4 pw-justify-center">
          {socialNetworks.map(({ icon, id, url, className }) => (
            <a
              key={id}
              href={url}
              target="_blank"
              className={classNames('pw-w-8 pw-h-8', className)}
              rel="noreferrer"
            >
              {icon}
            </a>
          ))}
        </div>
        <div className="pw-w-[304px] sm:pw-w-full pw-bg-[#090909] sm:pw-bg-[#E4E4E4] pw-h-[1px]" />
        <div className="pw-flex pw-items-center pw-gap-1 pw-font-normal pw-text-xs pw-leading-[15px] pw-text-center">
          <ComercialIcon className="pw-h-4 pw-w-4" />
          {translate('home>footer>copyright')}
        </div>
        <div className="pw-flex pw-items-center">
          <img
            src={LogoW3block}
            width={'181.07px'}
            height={'49.77px'}
            alt="Logo"
            className="footer-logo-w3block"
          />
        </div>
      </div>
    </div>
  );
};

export const W3blockFooter = (props: W3blockFooterProps) => (
  <TranslatableComponent>
    <_W3blockFooter {...props} />
  </TranslatableComponent>
);
