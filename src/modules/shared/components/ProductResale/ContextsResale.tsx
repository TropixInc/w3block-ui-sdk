import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import useTranslation from '../../hooks/useTranslation';
import { Alert } from '../Alert';
import { BaseButton } from '../Buttons';

interface Params {
  id?: string;
  slug: string;
}

export const ContextsResale = ({ slug, id }: Params) => {
  const [translate] = useTranslation();

  return slug === 'bankdetails' ? (
    <Alert
      className="pw-flex-col !pw-p-5 !pw-justify-start !pw-items-start pw-gap-3"
      variant="warning"
    >
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
    </Alert>
  ) : (
    <Alert
      className="pw-flex-col !pw-p-5 !pw-justify-start !pw-items-start pw-gap-3"
      variant="warning"
    >
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
    </Alert>
  );
};
