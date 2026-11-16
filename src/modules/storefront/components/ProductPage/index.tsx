/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';

import { ErrorBox } from '../../../shared/components/ErrorBox';
import { Spinner } from '../../../shared/components/Spinner';
import { CheckboxAlt } from '../../../shared/components/CheckboxAlt';
import useTranslation from '../../../shared/hooks/useTranslation';
import { convertSpacingToCSS } from '../../../shared/utils/convertSpacingToCSS';
import { useThemeConfig } from '../../hooks/useThemeConfig';
import { useMobilePreferenceDataWhenMobile } from '../../hooks/useMergeMobileData';
import { ProductVariants } from '../ProductVariants';
import { SendGiftForm } from '../SendGiftForm';
import { useProductPageLogic } from '../../hooks/useProductPageLogic';
import { ProductImageGallery } from './ProductImageGallery';
import { ProductPriceDisplay } from './ProductPriceDisplay';
import { ProductQuantitySelector } from './ProductQuantitySelector';
import { ProductActionButtons } from './ProductActionButtons';
import { ProductDescription } from './ProductDescription';
import { ProductBlockchainInfo } from './ProductBlockchainInfo';
import { ProductRequirementModals } from './ProductRequirementModals';
import type { ProductPageData } from '../../interfaces/Theme';

interface ProductPageProps {
  data: ProductPageData;
  params?: string[];
  hasCart?: boolean;
}

export const ProductPage = ({
  data,
  params,
  hasCart = true,
}: ProductPageProps) => {
  const { styleData, mobileStyleData } = data;
  const mergedStyleData = useMobilePreferenceDataWhenMobile(
    styleData,
    mobileStyleData
  );

  const {
    actionButton,
    backBackgroundColor,
    backgroundColor,
    buttonColor,
    buttonText,
    buttonTextColor,
    categoriesTextColor,
    descriptionTextColor,
    margin,
    nameTextColor,
    padding,
    priceTextColor,
    showBlockchainInfo,
    showCategory,
    showDescription,
    showProductName,
    showValue,
  } = mergedStyleData;

  const [translate] = useTranslation();
  const { defaultTheme } = useThemeConfig();
  const variantsType =
    defaultTheme?.configurations?.contentData?.productVariantsType;

  const slug = useMemo(
    () => params?.[params?.length - 1],
    [params]
  );

  const logic = useProductPageLogic({
    slug,
    buttonText,
  });

  const {
    product,
    errorProduct,
    currencyId,
    setCurrencyId,
    variants,
    setVariants,
    quantity,
    setQuantity,
    orderPreview,
    isLoadingValue,
    termsChecked,
    error,
    cartOpen,
    giftData,
    setGiftData,
    deleteGiftKey,
    isOpenRefresh,
    setIsOpenRefresh,
    isOpen,
    setIsOpen,
    isSendGift,
    setIsSendGift,
    isErc20,
    batchSize,
    productKycRequirement,
    isPossibleSend,
    userHasIntegration,
    toTenant,
    user,
    soldOut,
    reachStock,
    minCartItemPriceBlock,
    selectedPrice,
    handleTenantIntegration,
    handleClick,
    handleRefresh,
    addToCart,
    handleBuyClick,
    handleButtonText,
    onChangeCheckbox,
    isPageLoading,
  } = logic;

  const handleRefreshAndIntegrate = () => {
    handleRefresh();
    handleTenantIntegration({
      host:
        toTenant?.hosts?.find((h: { isMain?: boolean }) => h.isMain === true)
          ?.hostname ?? '',
      toTenantName: toTenant?.name ?? '',
      toTenantId: toTenant?.id ?? '',
    });
    setIsOpen(false);
  };

  if (errorProduct) {
    return <ErrorBox customError={errorProduct} />;
  }

  if (isPageLoading) {
    return (
      <div
        style={{
          margin: convertSpacingToCSS(margin),
          padding: convertSpacingToCSS(padding),
          backgroundColor: backgroundColor ?? '#EFEFEF',
        }}
        className="pw-min-h-[95vh] pw-flex pw-items-center pw-justify-center"
      >
        <Spinner className="!pw-w-12 !pw-h-12" />
      </div>
    );
  }

  return (
    <div
      style={{
        margin: convertSpacingToCSS(margin),
        padding: convertSpacingToCSS(padding),
      }}
    >
      <div style={{ backgroundColor: backBackgroundColor ?? 'white' }} />
      <ProductRequirementModals
        cartOpen={cartOpen}
        isOpenRefresh={isOpenRefresh ?? false}
        onCloseRefresh={() => setIsOpenRefresh(false)}
        isOpen={isOpen ?? false}
        onClose={() => setIsOpen(false)}
        isFetching={logic.isFetching}
        product={product}
        userHasIntegration={userHasIntegration}
        descriptionTextColor={descriptionTextColor}
        onRefreshAndIntegrate={handleRefreshAndIntegrate}
      />
      <div
        className="pw-min-h-[95vh]"
        style={{ backgroundColor: backgroundColor ?? '#EFEFEF' }}
      >
        <div className="pw-container pw-mx-auto pw-px-4 sm:pw-px-0 pw-py-6">
          <div className="pw-w-full pw-rounded-[14px] pw-bg-white pw-p-[40px_47px] pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)]">
            <div className="pw-flex pw-flex-col sm:pw-flex-row pw-gap-12">
              <ProductImageGallery
                images={product?.images}
                disableImageDisplay={product?.settings?.disableImageDisplay}
              />
              <div className="pw-w-full">
                {showProductName && (
                  <p
                    style={{ color: nameTextColor ?? 'black' }}
                    className="sm:pw-text-[36px] pw-text-2xl pw-font-[600]"
                  >
                    {product?.name}
                  </p>
                )}
                {showCategory && product?.tags?.length && (
                  <p
                    style={{ color: categoriesTextColor ?? '#C63535' }}
                    className="pw-mt-4 pw-font-[700] pw-text-lg"
                  >
                    {product?.tags?.map((tag: any) => tag.name).join('/')}
                  </p>
                )}
                {showValue && (
                  <ProductPriceDisplay
                    product={product}
                    currencyId={currencyId}
                    onCurrencyChange={setCurrencyId}
                    orderPreview={orderPreview}
                    isLoadingValue={isLoadingValue}
                    soldOut={soldOut}
                    priceTextColor={priceTextColor}
                    isErc20={isErc20}
                  />
                )}
                <div className="pw-flex pw-flex-col pw-gap-1 sm:pw-w-[350px] pw-w-full">
                  {product?.variants?.map((val: any) => (
                    <ProductVariants
                      key={val.id}
                      variants={val}
                      onClick={(e: any) => {
                        setVariants({
                          ...variants,
                          [val.id]: Object.values(e)[0],
                        });
                      }}
                      productId={product?.id}
                      type={variantsType}
                      borderColor={buttonColor ?? '#0050FF'}
                    />
                  ))}
                </div>
                {!soldOut &&
                  actionButton &&
                  product?.stockAmount &&
                  product.stockAmount > 0 &&
                  product?.canPurchase &&
                  !currencyId?.crypto && (
                    <ProductQuantitySelector
                      product={product}
                      currencyId={currencyId}
                      quantity={quantity}
                      setQuantity={setQuantity}
                      orderPreview={orderPreview}
                      isLoadingValue={isLoadingValue}
                      reachStock={reachStock}
                      batchSize={batchSize}
                      isErc20={isErc20}
                      error={error}
                    />
                  )}
                {isPossibleSend && (
                  <SendGiftForm
                    dataFields={
                      product?.settings?.passShareCodeConfig?.dataFields ?? []
                    }
                    isSendGift={isSendGift}
                    setIsSendGift={setIsSendGift}
                    data={giftData}
                    setData={setGiftData}
                    deleteKey={deleteGiftKey}
                  />
                )}
                <ProductActionButtons
                  hasCart={hasCart}
                  hasWhitelistBlocker={product?.hasWhitelistBlocker ?? false}
                  stockAmount={product?.stockAmount}
                  requirementCTALabel={
                    product?.requirements?.requirementCTALabel
                  }
                  requirementDescription={
                    product?.requirements?.requirementDescription
                  }
                  buttonColor={buttonColor}
                  buttonTextColor={buttonTextColor}
                  buttonText={buttonText}
                  currencyId={currencyId}
                  user={user}
                  hasRequirements={!!product?.requirements}
                  isSendGift={isSendGift}
                  giftData={giftData}
                  isPossibleSend={isPossibleSend}
                  soldOut={soldOut}
                  minCartItemPriceBlock={minCartItemPriceBlock}
                  termsChecked={termsChecked}
                  productKycRequirement={productKycRequirement}
                  canPurchaseAmount={product?.canPurchaseAmount}
                  selectedPriceAmount={selectedPrice?.amount}
                  onHandleClick={handleClick}
                  onAddToCart={addToCart}
                  onBuyClick={handleBuyClick}
                  buttonTextHandler={handleButtonText}
                />
                {selectedPrice?.anchorCurrencyId && (
                  <p className="pw-text-xs pw-mt-2 pw-font-medium pw-text-[#777E8F]">
                    *{translate('checkout>checkoutInfo>valueOfProductOn')}{' '}
                    {selectedPrice?.currency?.symbol}{' '}
                    {translate('checkout>checkoutInfo>varyAcordingExchange')}{' '}
                    {
                      product?.prices?.find(
                        (p: any) =>
                          p.currencyId === selectedPrice?.anchorCurrencyId
                      )?.currency?.symbol
                    }
                    .
                  </p>
                )}
                <div className="pw-mt-8">
                  {product?.terms?.map((val: any) => (
                    <CheckboxAlt
                      id={val.title}
                      onChange={onChangeCheckbox}
                      key={val.title}
                      label={val.title}
                      link={val.link}
                      description={val.description}
                      className="pw-mt-3"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="pw-flex sm:pw-flex-row pw-flex-col pw-gap-11 pw-w-full pw-mt-6">
            {showDescription && (
              <ProductDescription
                htmlContent={product?.htmlContent}
                description={product?.description}
                descriptionTextColor={descriptionTextColor}
                className={
                  showBlockchainInfo ? 'pw-flex-[2]' : 'pw-w-full'
                }
              />
            )}
            {showBlockchainInfo && (
              <ProductBlockchainInfo
                chainId={product?.chainId}
                contractAddress={product?.contractAddress}
                keyCollectionId={product?.draftData?.keyCollectionId}
                stockAmount={product?.stockAmount}
                tokensAmount={product?.tokensAmount}
                showDescription={!!showDescription}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
