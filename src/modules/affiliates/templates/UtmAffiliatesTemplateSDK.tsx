import { InternalPagesLayoutBase } from '../../shared/components/InternalPagesLayoutBase';
import TranslatableComponent from '../../shared/components/TranslatableComponent';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { SectionCard } from '../../shared/components/ui/SectionCard';
import useTranslation from '../../shared/hooks/useTranslation';
import { UtmAffiliates } from '../components/UtmAffiliates';

const _UtmAffiliatesTemplateSDK = () => {
  const [translate] = useTranslation();
  return (
    <div className="pw-flex pw-flex-col pw-gap-4 pw-px-4 sm:pw-px-0 pw-w-full">
      <PageHeader title={translate('shared>menu>affiliates')} />
      <SectionCard className="[&_h1]:pw-hidden [&_h2]:pw-text-[15px] [&_h2]:pw-font-semibold [&_p]:pw-text-[13.5px]">
        <UtmAffiliates />
      </SectionCard>
    </div>
  );
};

export const UtmAffiliatesTemplateSDK = () => {
  return (
    <TranslatableComponent>
      <InternalPagesLayoutBase>
        <_UtmAffiliatesTemplateSDK />
      </InternalPagesLayoutBase>
    </TranslatableComponent>
  );
};
