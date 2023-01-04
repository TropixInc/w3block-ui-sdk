import { useLocalStorage } from 'react-use';

import TranslatableComponent from '../../shared/components/TranslatableComponent';
import useTranslation from '../../shared/hooks/useTranslation';

export const Cookies = ({ data, defaultData }: CookiesProps) => {
  const [translate] = useTranslation();
  const [value, setValue] = useLocalStorage('acceptedCookies', 'false');

  const {
    cookiesBgColor,
    cookiesTextColor,
    cookiesButtonBgColor,
    cookiesButtonTextColor,
    privacyPolicyLinkColor,
  } = { ...defaultData, ...data };

  const disclaimer = data?.disclaimer;
  const privacyPolicyLink = data?.privacyPolicyLink;

  if (value === 'true') return null;

  return (
    <TranslatableComponent>
      <div
        style={{ background: cookiesBgColor }}
        className="pw-w-full sm:pw-h-[171px] pw-p-4 pw-flex pw-justify-center pw-font-poppins"
      >
        <div className="pw-flex pw-items-center pw-justify-between pw-h-full pw-container pw-flex-wrap lg:pw-flex-nowrap">
          <p
            className="pw-text-lg pw-max-w-[1300px]"
            style={{ color: cookiesTextColor }}
          >
            {disclaimer}{' '}
            <a
              href={privacyPolicyLink}
              target="_blank"
              style={{ color: privacyPolicyLinkColor }}
              rel="noreferrer"
            >
              {translate('storefront>cookies>privacyPolicy')}
            </a>
          </p>
          <button
            style={{
              background: cookiesButtonBgColor,
              color: cookiesButtonTextColor,
            }}
            className="pw-border-none pw-h-[32px] pw-w-[109px] pw-rounded-md"
            onClick={() => setValue('true')}
          >
            {translate('storefront>cookies>iAgree')}
          </button>
        </div>
      </div>
    </TranslatableComponent>
  );
};

export type CookiesData = Partial<CookiesDefault> & {
  privacyPolicyLink?: string;
  disclaimer?: string;
};

export type CookiesDefault = {
  cookiesBgColor: string;
  cookiesTextColor: string;
  cookiesButtonBgColor: string;
  cookiesButtonTextColor: string;
  privacyPolicyLinkColor: string;
};

export type CookiesProps = { data: CookiesData; defaultData: CookiesDefault };
