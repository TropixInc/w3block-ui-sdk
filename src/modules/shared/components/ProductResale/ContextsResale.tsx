import { useMemo } from 'react';

import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { useProfile } from '../../hooks';
import { useGetContextByUserId } from '../../hooks/useGetContextByUserId/useGetContextByUserId';
import useTranslation from '../../hooks/useTranslation';
import { BaseButton } from '../Buttons';

interface Params {
  contextId: string;
  slug: string;
}

export const ContextsResale = ({ contextId, slug }: Params) => {
  const [translate] = useTranslation();
  const profile = useProfile();
  const { data } = useGetContextByUserId(
    profile?.data?.data?.id ?? '',
    contextId
  );
  const context = useMemo(() => {
    return data?.data?.items?.[0];
  }, [data?.data?.items]);

  if (
    context?.status === 'draft' ||
    context?.status === 'requiredReview' ||
    (!context && slug === 'bankdetails')
  ) {
    return slug === 'bankdetails' ? (
      <div className="pw-flex pw-flex-col pw-w-full pw-gap-2 pw-p-4 pw-justify-center pw-items-start pw-bg-[#FFF9E3] pw-text-[#EEA109] pw-rounded-lg">
        <p>{translate('pages>mysales>resale>fillBankDetails')}</p>
        <BaseButton
          link={{
            href:
              PixwayAppRoutes.COMPLETE_KYC +
              `?contextSlug=${slug}` +
              (context ? `&userContextId=${context?.id}` : ''),
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
              (context ? `&userContextId=${context?.id}` : '') +
              '&step=1',
          }}
        >
          {translate('pages>mysales>resale>fillData')}
        </BaseButton>
      </div>
    );
  } else return null;
};
