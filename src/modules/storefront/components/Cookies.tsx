import { useLocalStorage } from 'react-use';

import TranslatableComponent from '../../shared/components/TranslatableComponent';
import useTranslation from '../../shared/hooks/useTranslation';
import { CookiesData } from '../interfaces';

export const Cookies = ({ data }: { data: CookiesData }) => {
  const [translate] = useTranslation();
  const [acceptedCookies, setAcceptedCookies] = useLocalStorage(
    'acceptedCookies',
    'false'
  );

  const { styleData, contentData } = data;
  const {
    backgroundColor,
    textColor,
    buttonBgColor,
    buttonTextColor,
    privacyPolicy,
    privacyPolicyLinkColor,
    privacyPolicyLink,
  } = styleData;

  const sampleDisclaimer =
    'Nós utilizamos cookies e outras tecnologias semelhantes para coletar dados durante a navegação para melhorar a sua experiência em nossos serviços. Saiba mais em nossa';

  if (acceptedCookies === 'true') return null;

  return (
    <TranslatableComponent>
      <div
        style={{ backgroundColor }}
        className="pw-box-border lg:pw-max-h-[89px] pw-py-3 lg:pw-py-[23.5px] pw-px-14 lg:pw-px-[114px] pw-flex pw-justify-center pw-items-center pw-bottom-0 pw-left-0 pw-right-0 pw-z-50 pw-sticky"
      >
        <div className="pw-max-w-[1029px] pw-flex pw-items-center pw-justify-between pw-h-full pw-flex-wrap lg:pw-flex-nowrap">
          <p
            className="pw-text-sm pw-max-w-[949px] pw-font-roboto pw-leading-5"
            style={{ color: textColor }}
          >
            {contentData?.disclaimer || sampleDisclaimer}{' '}
            {privacyPolicy && (
              <a
                href={privacyPolicyLink}
                target="_blank"
                style={{ color: privacyPolicyLinkColor }}
                rel="noreferrer"
                className="pw-font-bold"
              >
                {translate('storefront>cookies>privacyPolicy')}
              </a>
            )}
          </p>
          <button
            style={{
              background: buttonBgColor,
              color: buttonTextColor,
            }}
            className="pw-border-none pw-text-sm pw-h-[32px] pw-w-[109px] pw-px-4 pw-py-2 pw-rounded-lg pw-whitespace-nowrap pw-font-roboto pw-leading-4"
            onClick={() => setAcceptedCookies('true')}
          >
            {translate('storefront>cookies>iAgree')}
          </button>
        </div>
      </div>
    </TranslatableComponent>
  );
};
