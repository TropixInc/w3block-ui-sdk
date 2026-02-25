"use client";

import { PixwayButton } from '../../../shared/components/PixwayButton';

interface CouponSectionProps {
  couponCodeInput?: string;
  appliedCoupon?: string | null;
  onApply: () => void;
  translate: (key: string) => string;
}

export function CouponSection({
  couponCodeInput,
  appliedCoupon,
  onApply,
  translate,
}: CouponSectionProps) {
  return (
    <>
      <p className="pw-font-[600] pw-text-lg pw-text-[#35394C] pw-mt-5 pw-mb-2">
        {translate('checkout>checkoutInfo>coupon')}
      </p>
      <div className="pw-mb-8">
        <div className="pw-flex pw-gap-3">
          <input
            name="couponCode"
            id="couponCode"
            placeholder={translate('checkout>checkoutInfo>couponCode')}
            className="pw-p-2 pw-rounded-lg pw-border pw-border-[#DCDCDC] pw-shadow-md pw-text-black pw-flex-[0.3] focus:pw-outline-none"
            defaultValue={couponCodeInput}
          />
          <PixwayButton
            onClick={onApply}
            className="!pw-py-3 sm:!pw-px-[42px] !pw-px-0 sm:pw-flex-[0.1] pw-flex-[1] !pw-bg-[#EFEFEF] !pw-text-xs !pw-text-[#383857] !pw-border !pw-border-[#DCDCDC] !pw-rounded-full hover:pw-shadow-xl disabled:hover:pw-shadow-none"
          >
            {translate('checkout>checkoutInfo>applyCoupon')}
          </PixwayButton>
        </div>
        {appliedCoupon && (
          <p className="pw-text-gray-500 pw-text-xs pw-mt-2">
            {translate('checkout>checkoutInfo>coupon')}{' '}
            <b>&apos;{appliedCoupon}&apos;</b>{' '}
            {translate('checkout>checkoutInfo>couponAppliedSucces')}
          </p>
        )}
        {appliedCoupon === null &&
          couponCodeInput !== '' &&
          couponCodeInput !== undefined && (
            <p className="pw-text-red-500 pw-text-xs pw-mt-2">
              {translate('checkout>checkoutInfo>invalidCoupon')}
            </p>
          )}
      </div>
    </>
  );
}
