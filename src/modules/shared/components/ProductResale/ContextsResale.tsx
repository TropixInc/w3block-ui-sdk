import { useTranslation } from 'react-i18next';
import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';

import { BaseButton } from '../Buttons';

interface Params {
  id?: string;
  slug: string;
}

export const ContextsResale = ({ slug, id }: Params) => {
  const [translate] = useTranslation();

  return slug === 'bankdetails' ? (
    <div className="pw-flex pw-flex-col pw-w-full pw-gap-2 pw-p-4 pw-justify-center pw-items-start pw-bg-[#FFF9E3] pw-text-[#EEA109] pw-rounded-lg">
      <p>{translate('pages>mysales>resale>fillBankDetails')}</p>
      <BaseButton
        link={{
          href:
            PixwayAppRoutes.COMPLETE_KYC +
            `?contextSlug=${slug}` +
            (id && id !== '1' ? `&userContextId=${id}` : ''),
        }}
      >
        {translate('pages>mysales>resale>fillData')}
      </BaseButton>
    </div>
  ) : (
    <div className="pw-flex pw-flex-col pw-w-full pw-gap-2 pw-p-4 pw-justify-center pw-items-start pw-bg-[#FFF9E3] pw-text-[#EEA109] pw-rounded-lg">
      <p>{translate('pages>mysales>resale>fillExtraDetails')}</p>
      <BaseButton
        link={{
          href:
            PixwayAppRoutes.COMPLETE_KYC +
            `?contextSlug=${slug}` +
            (id ? `&userContextId=${id}` : '') +
            '&step=1',
        }}
      >
        {translate('pages>mysales>resale>fillData')}
      </BaseButton>
    </div>
  );
};
