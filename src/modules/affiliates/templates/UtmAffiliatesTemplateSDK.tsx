import { InternalPagesLayoutBase } from '../../shared/components/InternalPagesLayoutBase';
import { UtmAffiliates } from '../components/UtmAffiliates';

export const UtmAffiliatesTemplateSDK = () => {
  return (
    <InternalPagesLayoutBase>
      <div className="pw-px-4 sm:pw-px-0 pw-w-full">
        <div className="pw-w-full pw-flex pw-flex-col pw-gap-[34px] pw-items-start pw-bg-white pw-rounded-[10px] pw-shadow-[0_2px_8px_rgba(0,0,0,0.06)] pw-p-6 sm:pw-p-[34px]">
          <UtmAffiliates />
        </div>
      </div>
    </InternalPagesLayoutBase>
  );
};
