import classNames from 'classnames';

import UploadIcon from '../../shared/assets/icons/uploadIcon.svg';
import { KpiCard, KpiRow } from '../../shared/components/ui/KpiCard';
import { SectionCard } from '../../shared/components/ui/SectionCard';
import { UI } from '../../shared/components/ui/tokens';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import useTranslation from '../../shared/hooks/useTranslation';
import { useUserWallet } from '../../shared/hooks/useUserWallet/useUserWallet';
import { formatAmount } from '../../shared/utils/formatAmount';

/**
 * Add funds: the custodial wallet balance and the ways to top it up. Today
 * there is one way (manual transfer), shown as a selectable card.
 */
export const AddFundsChoosePaymentContainer = () => {
  const { mainWallet: wallet } = useUserWallet();
  const { name: companyName } = useCompanyConfig();
  const [translate] = useTranslation();
  const router = useRouterConnect();

  return (
    <div className="pw-flex pw-flex-col pw-gap-4">
      <KpiRow>
        <KpiCard
          variant="accent"
          label={translate('addFunds>type>totalBalance')}
          value={formatAmount(wallet?.balance ?? 0)}
          hint={companyName || translate('addFunds>type>weblockWallet')}
          loading={!wallet}
        />
      </KpiRow>
      <SectionCard title={translate('addFunds>type>choosePaymentType')}>
        <div className="pw-grid pw-grid-cols-1 sm:pw-grid-cols-2 pw-gap-3">
          <button
            type="button"
            onClick={() => router.pushConnect(PixwayAppRoutes.ADD_FUNDS_MANUAL)}
            className={classNames(
              'pw-flex pw-items-center pw-gap-3 pw-p-4 pw-rounded-[10px] pw-border pw-border-[#E6E8EC] pw-bg-white pw-text-left hover:pw-border-brand-primary pw-transition-colors',
              UI.focusRing
            )}
          >
            <span className="pw-grid pw-place-items-center pw-w-10 pw-h-10 pw-rounded-lg pw-bg-[#EAF1FC] pw-text-[#2F6FD0] pw-shrink-0 [&_svg]:pw-stroke-current">
              <UploadIcon />
            </span>
            <span className="pw-min-w-0">
              <span
                className={classNames(
                  'pw-block pw-text-[14px] pw-font-semibold',
                  UI.text
                )}
              >
                {translate('addFunds>type>manualType')}
              </span>
              <span
                className={classNames(
                  'pw-block pw-text-[12.5px]',
                  UI.textMuted
                )}
              >
                {translate('addFunds>type>manualDescription')}
              </span>
            </span>
          </button>
        </div>
      </SectionCard>
    </div>
  );
};
