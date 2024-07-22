const WeblockButton = lazy(() =>
  import('../../../shared/components/WeblockButton/WeblockButton').then(
    (m) => ({ default: m.WeblockButton })
  )
);
import { lazy } from 'react';

import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect/useRouterConnect';
import useTranslation from '../../../shared/hooks/useTranslation';

export const CheckoutEmptyCart = () => {
  const { pushConnect } = useRouterConnect();
  const [translate] = useTranslation();
  return (
    <div className="pw-min-h-[95vh] pw-bg-[#F7F7F7]">
      <div className="pw-container pw-mx-auto">
        <div className="pw-flex pw-flex-col pw-justify-center pw-items-center pw-pt-[96px]">
          <p className="pw-text-center pw-font-[600] pw-text-[20px] pw-text-black sm:pw-text-[32px]">
            {translate('checkout>checkoutEmptyCart>emptyCart')}
          </p>
          <p className="pw-text-center pw-font-[400] pw-text-[14px] pw-text-black sm:pw-text-[15px] pw-mt-4">
            {translate('checkout>checkoutEmptyCart>clickForPossibilities')}
          </p>
          <WeblockButton
            className="pw-text-white pw-mt-[28px]"
            onClick={() => pushConnect(PixwayAppRoutes.HOME)}
          >
            {translate('checkout>checkoutEmptyCart>continueExploring')}
          </WeblockButton>
        </div>
      </div>
    </div>
  );
};
