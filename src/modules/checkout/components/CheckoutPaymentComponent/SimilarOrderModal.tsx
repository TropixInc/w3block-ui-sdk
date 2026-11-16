import { useState } from 'react';

import { ModalBase } from '../../../shared/components/ModalBase';
import { PixwayButton } from '../../../shared/components/PixwayButton';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import useTranslation from '../../../shared/hooks/useTranslation';

interface SimilarOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export const SimilarOrderModal = ({
  isOpen,
  onClose,
  onContinue,
}: SimilarOrderModalProps) => {
  const [agree, setAgree] = useState(false);
  const router = useRouterConnect();
  const [translate] = useTranslation();

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      clickAway={false}
      hideCloseButton
      classes={{ classComplement: 'sm:!pw-p-8 !pw-p-4' }}
    >
      <div className="pw-p-8 pw-text-center pw-text-black">
        <p className="sm:pw-text-base pw-text-sm">
          {translate('checkout>checkoutPaymentComponent>verifyPurchase')}
        </p>
        <p className="pw-font-semibold pw-mt-2 sm:pw-text-base pw-text-sm">
          {translate('checkout>checkoutPaymentComponent>continuePurchase')}
        </p>

        <div className="pw-flex pw-flex-col pw-justify-around pw-mt-6">
          <PixwayButton
            onClick={() => router.pushConnect(PixwayAppRoutes.MY_ORDERS)}
            className="pw-mt-4 !pw-py-3 !pw-px-[42px] !pw-bg-white !pw-text-xs !pw-text-black pw-border pw-border-slate-800 !pw-rounded-full hover:pw-bg-slate-500 hover:pw-shadow-xl"
          >
            {translate('checkout>checkoutPaymentComponent>seePurchase')}
          </PixwayButton>
          <PixwayButton
            disabled={!agree}
            onClick={onContinue}
            className="pw-mt-4 !pw-py-3 !pw-px-[42px] !pw-bg-white !pw-text-xs !pw-text-black pw-border pw-border-slate-800 !pw-rounded-full hover:pw-bg-slate-500 disabled:pw-opacity-50 disabled:!pw-bg-white hover:pw-shadow-xl"
          >
            {translate('checkout>checkoutPaymentComponent>confirmPurchase')}
          </PixwayButton>
        </div>
        <div className="pw-flex sm:pw-gap-3 pw-gap-2 pw-items-center pw-justify-center pw-my-5">
          <div
            onClick={() => setAgree(!agree)}
            className="pw-flex pw-w-[18px] pw-h-[18px] pw-rounded-sm pw-border-slate-400 pw-border pw-justify-center pw-items-center"
          >
            {agree && (
              <div className="pw-w-[10px] pw-h-[10px] pw-bg-blue-600 pw-rounded-sm"></div>
            )}
          </div>
          <p className="sm:pw-text-base pw-text-xs pw-text-slate-600">
            {translate(
              'checkout>checkoutPaymentComponent>confirmPurchaseSameValue'
            )}
          </p>
        </div>
      </div>
    </ModalBase>
  );
};
