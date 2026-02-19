/* eslint-disable @typescript-eslint/no-explicit-any */
import useTranslation from '../../../shared/hooks/useTranslation';
import type { CurrencyResponse } from '../../interfaces/Product';

interface ProductActionButtonsProps {
  hasCart: boolean;
  hasWhitelistBlocker: boolean;
  stockAmount: number | undefined;
  requirementCTALabel?: string;
  requirementDescription?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  buttonText?: string;
  currencyId: CurrencyResponse | undefined;
  user: unknown;
  hasRequirements: boolean;
  isSendGift: boolean;
  giftData: unknown;
  isPossibleSend: boolean;
  soldOut: boolean;
  minCartItemPriceBlock: boolean;
  termsChecked: boolean;
  productKycRequirement: string | undefined;
  canPurchaseAmount: number | undefined;
  selectedPriceAmount: string | undefined;
  onHandleClick: () => void;
  onAddToCart: () => void;
  onBuyClick: () => void;
  buttonTextHandler: () => string;
}

export const ProductActionButtons = ({
  hasCart,
  hasWhitelistBlocker,
  stockAmount,
  requirementCTALabel,
  requirementDescription,
  buttonColor = '#0050FF',
  buttonTextColor = 'white',
  buttonText,
  currencyId,
  user,
  hasRequirements,
  isSendGift,
  giftData,
  isPossibleSend,
  soldOut,
  minCartItemPriceBlock,
  termsChecked,
  productKycRequirement,
  canPurchaseAmount,
  selectedPriceAmount,
  onHandleClick,
  onAddToCart,
  onBuyClick,
  buttonTextHandler,
}: ProductActionButtonsProps) => {
  const [translate] = useTranslation();

  const giftDisabled = isSendGift && !giftData && isPossibleSend;
  const baseDisabled: boolean = Boolean(
    (user && !hasRequirements) || giftDisabled
  );

  const isDisabled = (btnType: 'requirement' | 'addCart' | 'buy') => {
    if (btnType === 'requirement') return baseDisabled ?? false;
    if (btnType === 'addCart')
      return soldOut || minCartItemPriceBlock || !termsChecked || giftDisabled;
    if (btnType === 'buy')
      return soldOut || minCartItemPriceBlock || !termsChecked || giftDisabled;
    return false;
  };

  const getButtonStyle = (disabled: boolean) => ({
    backgroundColor: disabled ? '#DCDCDC' : buttonColor,
    color: disabled ? '#777E8F' : buttonTextColor,
  });

  const getOutlineButtonStyle = (disabled: boolean) => ({
    backgroundColor: 'none',
    borderColor: disabled ? '#DCDCDC' : buttonColor,
    color: disabled ? '#DCDCDC' : buttonColor,
  });

  if (hasWhitelistBlocker && stockAmount !== 0) {
    if (requirementCTALabel) {
      return (
        <div className="pw-flex pw-flex-col pw-justify-center pw-items-start pw-w-full pw-mt-5">
          <p className="pw-text-sm pw-font-poppins pw-font-medium pw-text-black">
            {requirementDescription}
          </p>
          <button
            onClick={onHandleClick}
            disabled={isDisabled('requirement') ?? false}
            style={getButtonStyle(!!baseDisabled)}
            className="pw-py-[10px] pw-px-[60px] pw-font-[500] pw-text-xs pw-mt-3 pw-rounded-full sm:pw-w-[260px] pw-w-full pw-shadow-[0_2px_4px_rgba(0,0,0,0.26)]"
          >
            {requirementCTALabel}
          </button>
        </div>
      );
    }

    return (
      <div className="pw-flex pw-flex-col">
        {!currencyId?.crypto && hasCart && (
          <button
            onClick={onHandleClick}
            disabled={isDisabled('requirement') ?? false}
            style={getOutlineButtonStyle(!!baseDisabled)}
            className="pw-py-[10px] pw-px-[60px] pw-font-[500] pw-border sm:pw-w-[260px] pw-w-full pw-text-xs pw-mt-6 pw-rounded-full"
          >
            {translate('storefront>productPage>addCart')}
          </button>
        )}
        <button
          onClick={onHandleClick}
          disabled={
            hasWhitelistBlocker && user && !hasRequirements ? true : giftDisabled
          }
          style={getButtonStyle(
            !!(hasWhitelistBlocker && user && !hasRequirements) || giftDisabled
          )}
          className="pw-py-[10px] pw-px-[60px] pw-font-[700] pw-text-xs pw-mt-3 pw-rounded-full sm:pw-w-[260px] pw-w-full pw-shadow-[0_2px_4px_rgba(0,0,0,0.26)]"
        >
          {parseFloat(selectedPriceAmount ?? '0') === 0
            ? 'Quero!'
            : buttonText ?? 'Comprar agora'}
        </button>
      </div>
    );
  }

  return (
    <div className="pw-flex pw-flex-col">
      {hasCart && !productKycRequirement && (
        <button
          disabled={isDisabled('addCart') ?? false}
          onClick={onAddToCart}
          style={getOutlineButtonStyle(isDisabled('addCart') ?? false)}
          className="pw-py-[10px] pw-px-[60px] pw-font-[500] pw-border sm:pw-w-[260px] pw-w-full pw-text-xs pw-mt-6 pw-rounded-full"
        >
          {translate('storefront>productPage>addCart')}
        </button>
      )}
      <button
        disabled={isDisabled('buy') ?? false}
        onClick={onBuyClick}
        style={getButtonStyle(isDisabled('buy') ?? false)}
        className="pw-py-[10px] pw-px-[60px] pw-font-[700] pw-font pw-text-xs pw-mt-3 pw-rounded-full sm:pw-w-[260px] pw-w-full pw-shadow-[0_2px_4px_rgba(0,0,0,0.26)]"
      >
        {buttonTextHandler()}
      </button>
      {canPurchaseAmount === 0 && !hasWhitelistBlocker && (
        <p className="pw-text-sm pw-text-gray-500 pw-font-medium pw-mt-4">
          {translate('storefront>productPage>purchaseLimitPerUser')}
        </p>
      )}
    </div>
  );
};
