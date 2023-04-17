import { useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';

import { useCart } from '../../checkout/hooks/useCart';
import { useRouterConnect } from '../../shared';
import { ReactComponent as ArrowDown } from '../../shared/assets/icons/arrowDown.svg';
import { ReactComponent as BackButton } from '../../shared/assets/icons/arrowLeftOutlined.svg';
import { ImageSDK } from '../../shared/components/ImageSDK';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import useAdressBlockchainLink from '../../shared/hooks/useAdressBlockchainLink/useAdressBlockchainLink';
import useTranslation from '../../shared/hooks/useTranslation';
import { convertSpacingToCSS } from '../../shared/utils/convertSpacingToCSS';
import useGetProductBySlug, {
  CurrencyResponse,
} from '../hooks/useGetProductBySlug/useGetProductBySlug';
import { useMobilePreferenceDataWhenMobile } from '../hooks/useMergeMobileData/useMergeMobileData';
import { ProductPageData } from '../interfaces';

interface ProductPageProps {
  data: ProductPageData;
  params?: string[];
}

export const ProductPage = ({ data, params }: ProductPageProps) => {
  const { styleData, mobileStyleData } = data;

  const mergedStyleData = useMobilePreferenceDataWhenMobile(
    styleData,
    mobileStyleData
  );

  const {
    actionButton,
    backBackgroundColor,
    backTextColor,
    backgroundColor,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    blockchainInfoBackgroundColor,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    blockchainInfoTextColor,
    buttonColor,
    buttonText,
    buttonTextColor,
    categoriesTagBackgroundColor,
    categoriesTagTextColor,
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
    textColor,
  } = mergedStyleData;

  const [translate] = useTranslation();
  const { back, pushConnect } = useRouterConnect();
  const { setCart, cart, setCartCurrencyId } = useCart();
  const [currencyId, setCurrencyId] = useState<CurrencyResponse>();
  const refToClickAway = useRef<HTMLDivElement>(null);
  useClickAway(refToClickAway, () => {
    if (quantityOpen) {
      setQuantityOpen(false);
    }
  });

  const [quantity, setQuantity] = useState(1);
  const [quantityOpen, setQuantityOpen] = useState(false);
  const { data: product, isSuccess } = useGetProductBySlug(
    params?.[params.length - 1]
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categories: any[] = [];
  const limit =
    product?.stockAmount &&
    product.canPurchaseAmount &&
    product?.stockAmount > product.canPurchaseAmount
      ? product.canPurchaseAmount
      : product?.stockAmount;

  const addToCart = () => {
    setCartCurrencyId?.(currencyId);
    cart.some((p) => p.id == product?.id)
      ? setCart(cart.filter((p) => p.id != product?.id))
      : setCart([...cart, ...Array(quantity).fill(product)]);
  };

  useEffect(() => {
    if (isSuccess) setCurrencyId(product?.prices[0]?.currency ?? undefined);
  }, [product, isSuccess]);

  const tokensSold =
    product?.tokensAmount && product?.stockAmount
      ? product?.tokensAmount - product?.stockAmount
      : 0;

  const addresBlockchainLink = useAdressBlockchainLink(
    product?.chainId,
    product?.contractAddress
  );

  const chain = () => {
    switch (product?.chainId) {
      case 137:
        return 'Polygon';
      case 4:
        return 'Rinkeby';
      case 1:
        return 'Ethereum';
      default:
        return 'Mumbai';
    }
  };

  return (
    <div
      style={{
        margin: convertSpacingToCSS(margin),
        padding: convertSpacingToCSS(padding),
      }}
    >
      <div
        style={{
          backgroundColor: backBackgroundColor ?? 'white',
        }}
      >
        <div
          onClick={() => back()}
          className="pw-container pw-mx-auto pw-flex pw-items-center pw-gap-6 pw-py-4 pw-cursor-pointer pw-px-4 sm:pw-px-0"
        >
          <BackButton
            style={{
              stroke: backTextColor ?? textColor ? textColor : '#777E8F',
            }}
          />
          <p
            style={{
              color: backTextColor ?? textColor ? textColor : '#777E8F',
            }}
            className="pw-text-sm"
          >
            Voltar
          </p>
        </div>
      </div>
      <div
        className="pw-min-h-[95vh]"
        style={{ backgroundColor: backgroundColor ?? '#EFEFEF' }}
      >
        <div className="pw-container pw-mx-auto pw-px-4 sm:pw-px-0 pw-py-6">
          <div className="pw-flex pw-flex-col sm:pw-flex-row pw-w-full pw-gap-8 pw-rounded-[14px] pw-bg-white pw-p-[40px_47px] pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)]">
            <div className="pw-max-h-[500px]  pw-flex-1">
              <ImageSDK
                className="pw-w-full pw-max-h-[400px] sm:pw-max-h-[500px] pw-object-cover pw-object-center"
                src={product?.images[0].original}
              />
            </div>
            <div className="pw-max-w-[400px] pw-w-full">
              {showProductName && (
                <>
                  <p
                    style={{ color: nameTextColor ?? 'black' }}
                    className="pw-text-[36px] pw-font-[600]"
                  >
                    {product?.name}
                  </p>
                </>
              )}
              {showCategory && (
                <p
                  style={{
                    color: categoriesTextColor ?? '#C63535',
                  }}
                  className="pw-mt-4 pw-font-[700] pw-text-lg"
                >
                  {product?.tags?.join('/')}
                </p>
              )}
              {showValue && (
                <>
                  {product?.prices != undefined &&
                    product?.prices?.length > 1 && (
                      <div className="">
                        <p className="pw-text-sm pw-text-black pw-font-[700] pw-mb-2">
                          Pagar em:
                        </p>
                        <form className="pw-flex pw-gap-4" action="submit">
                          {product?.prices.map((price) => (
                            <div
                              key={price.currencyId}
                              className="pw-flex pw-gap-2"
                            >
                              <input
                                onChange={() =>
                                  setCurrencyId?.(price?.currency)
                                }
                                checked={price.currencyId === currencyId?.id}
                                name="currency"
                                value={price.currencyId}
                                type="radio"
                              />
                              <p className="pw-text-xs pw-text-slate-600 pw-font-[600]">
                                {price.currency.symbol}
                              </p>
                            </div>
                          ))}
                        </form>
                      </div>
                    )}

                  <p
                    style={{ color: priceTextColor ?? 'black' }}
                    className="pw-text-2xl pw-mt-4 pw-font-[700]"
                  >
                    {product?.stockAmount == 0
                      ? 'Esgotado'
                      : product
                      ? `${
                          product?.prices.find(
                            (price) => price.currencyId == currencyId?.id
                          )?.currency.symbol
                        } ${
                          product?.prices.find(
                            (price) => price.currencyId == currencyId?.id
                          )?.amount
                        }`
                      : ''}
                  </p>
                </>
              )}
              {actionButton &&
                product?.stockAmount &&
                product?.stockAmount > 0 &&
                !currencyId?.crypto && (
                  <div>
                    <div ref={refToClickAway} className="pw-mt-4">
                      <p className="pw-text-sm pw-text-black pw-mb-1">
                        Quantidade
                      </p>
                      <div
                        onClick={() => setQuantityOpen(!quantityOpen)}
                        className={`pw-w-[120px]  pw-p-3 pw-flex pw-items-center pw-rounded-lg pw-justify-between pw-cursor-pointer ${
                          quantityOpen
                            ? 'pw-border-none pw-bg-white'
                            : 'pw-border pw-border-black'
                        }`}
                      >
                        <p className="pw-text-xs pw-font-[600] pw-text-black">
                          {quantity}
                        </p>
                        <ArrowDown className="pw-stroke-black" />
                      </div>
                      {quantityOpen && (
                        <div className="pw-relative">
                          <div className="pw-absolute pw-bg-white -pw-mt-1 pw-w-[120px] pw-flex pw-flex-col pw-py-1 pw-rounded-b-l ">
                            <div className="pw-border-t pw-bg-slate-400 pw-mx-3 pw-h-px"></div>
                            <div className=""></div>
                            {Array(limit && limit > 5 ? 5 : limit)
                              .fill(0)
                              .map((val, index) => (
                                <p
                                  onClick={() => {
                                    setQuantity(index + 1);
                                    setQuantityOpen(false);
                                  }}
                                  key={index}
                                  className="pw-px-3 pw-py-2 pw-text-sm pw-cursor-pointer hover:pw-bg-slate-100 pw-text-black"
                                >
                                  {index + 1}
                                </p>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              {showCategory && product?.tags?.length ? (
                <>
                  <p
                    style={{ color: textColor ?? 'black' }}
                    className="pw-mt-4 pw-text-sm"
                  >
                    Categoria/subcategoria:
                  </p>
                  <div className="pw-flex pw-items-center pw-gap-4 pw-mt-6">
                    {categories.map((cat) => (
                      <div
                        key={cat.name}
                        style={{
                          backgroundColor:
                            categoriesTagBackgroundColor ?? 'white',
                          color: categoriesTagTextColor ?? 'black',
                        }}
                        className="pw-py-2 pw-px-6 pw-text-sm pw-font-[600] pw-shadow-[0_2px_4px_rgba(0,0,0,0.26)]"
                      >
                        {cat.name}
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
              {actionButton && (
                <>
                  {!currencyId?.crypto && (
                    <button
                      disabled={
                        product?.stockAmount == 0 ||
                        product?.canPurchaseAmount == 0 ||
                        currencyId?.crypto
                      }
                      onClick={addToCart}
                      style={{
                        backgroundColor: 'none',
                        borderColor:
                          product &&
                          (product?.stockAmount == 0 ||
                            product?.canPurchaseAmount == 0)
                            ? '#DCDCDC'
                            : buttonColor
                            ? buttonColor
                            : '#0050FF',
                        color:
                          product &&
                          (product?.stockAmount == 0 ||
                            product?.canPurchaseAmount == 0)
                            ? '#777E8F'
                            : buttonColor ?? '#0050FF',
                      }}
                      className="pw-py-[10px] pw-px-[60px] pw-font-[500] pw-border sm:pw-w-[260px] pw-w-full pw-text-xs pw-mt-6 pw-rounded-full "
                    >
                      {cart.some((p) => p.id == product?.id)
                        ? 'Remover do carrinho'
                        : 'Adicionar ao carrinho'}
                    </button>
                  )}
                  <button
                    disabled={
                      product?.stockAmount == 0 ||
                      product?.canPurchaseAmount == 0
                    }
                    onClick={() => {
                      if (product?.id && product.prices) {
                        pushConnect(
                          PixwayAppRoutes.CHECKOUT_CONFIRMATION +
                            `?productIds=${Array(quantity)
                              .fill(product.id)
                              .join(',')}&currencyId=${currencyId?.id}`
                        );
                      }
                    }}
                    style={{
                      backgroundColor:
                        product &&
                        (product.stockAmount == 0 ||
                          product?.canPurchaseAmount == 0)
                          ? '#DCDCDC'
                          : buttonColor
                          ? buttonColor
                          : '#0050FF',
                      color:
                        product &&
                        (product.stockAmount == 0 ||
                          product?.canPurchaseAmount == 0)
                          ? '#777E8F'
                          : buttonTextColor ?? 'white',
                    }}
                    className="pw-py-[10px] pw-px-[60px] pw-font-[500] pw-text-xs pw-mt-3 pw-rounded-full sm:pw-w-[260px] pw-w-full pw-shadow-[0_2px_4px_rgba(0,0,0,0.26)]"
                  >
                    {buttonText ?? 'Comprar agora'}
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="pw-flex sm:pw-flex-row pw-flex-col pw-gap-11 pw-w-full pw-mt-6">
            {showDescription && (
              <div
                className={`${
                  showBlockchainInfo ? 'pw-max-w-[590px]' : ''
                } pw-flex-grow-[3] pw-rounded-[14px] pw-bg-white pw-p-[25px] pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)]`}
              >
                <p
                  style={{
                    color: descriptionTextColor ?? 'black',
                  }}
                  className="pw-text-[15px] pw-font-[600]"
                >
                  {translate('commerce>productPage>description')}
                </p>
                {product?.htmlContent && product?.htmlContent != '' ? (
                  <div
                    style={{
                      color: descriptionTextColor ?? 'black',
                    }}
                    className="pw-text-[13px] pw-pb-8 pw-mt-6"
                    dangerouslySetInnerHTML={{
                      __html: product?.htmlContent ?? '',
                    }}
                  ></div>
                ) : (
                  <p
                    style={{
                      color: descriptionTextColor ?? 'black',
                    }}
                    className="pw-text-[13px] pw-pb-8 pw-mt-6"
                  >
                    {product?.description}
                  </p>
                )}
              </div>
            )}
            {showBlockchainInfo && (
              <div className="pw-flex-grow pw-max-h-[265px] pw-rounded-[14px] pw-text-black pw-bg-white pw-p-[25px] pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)]">
                <p className="pw-text-[15px] pw-font-[600] pw-mb-4">
                  {translate('commerce>productPage>tokenDetails')}
                </p>
                <span className="pw-border-[#E6E8EC] pw-block pw-border pw-border-solid pw-w-full pw-mx-auto" />
                <div className="pw-mt-7 pw-text-[13px] pw-flex pw-justify-between">
                  <div>
                    <p>Contract Address</p>
                    <p className="pw-mt-[10px]">
                      {translate('commerce>productPage>totalTokens')}
                    </p>
                    <p className="pw-mt-[10px]">
                      {translate('commerce>productPage>soldTokens')}
                    </p>
                    <p className="pw-mt-[10px]">Token Standard</p>
                    <p className="pw-mt-[10px]">Chain</p>
                  </div>
                  <div
                    className={`pw-text-right ${
                      showDescription
                        ? 'sm:pw-max-w-[150px] pw-max-w-[100px]'
                        : 'pw-max-w-[100px] sm:pw-max-w-[295px]'
                    }`}
                  >
                    <p className="pw-truncate pw-underline pw-text-[#4194CD]">
                      <a href={addresBlockchainLink}>
                        {product?.contractAddress}
                      </a>
                    </p>
                    <p className="pw-mt-[10px]">{product?.tokensAmount}</p>
                    <p className="pw-mt-[10px]">{tokensSold}</p>
                    <p className="pw-mt-[10px]">ERC-721</p>
                    <p className="pw-mt-[10px]">{chain()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
