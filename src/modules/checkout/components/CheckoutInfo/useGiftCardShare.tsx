"use client";

import { useState } from 'react';
import { useCopyToClipboard } from 'react-use';

import { PixwayButton } from '../../../shared/components/PixwayButton';
import { SharedOrder } from '../../../pass/components/SharedOrder';
import { CreateOrderResponse, OrderPreviewCache } from '../../interface/interface';

interface UseGiftCardShareProps {
  orderResponse: CreateOrderResponse | null | undefined;
  statusResponse: CreateOrderResponse | undefined;
  productCache: OrderPreviewCache | null | undefined;
  profileName?: string;
  profileEmail?: string;
  isMobile: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  translate: (key: string, params?: Record<string, any>) => string;
}

export function useGiftCardShare({
  orderResponse,
  statusResponse,
  productCache,
  profileName,
  profileEmail,
  isMobile,
  translate,
}: UseGiftCardShareProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [, copyToClipboard] = useCopyToClipboard();

  const shareMessage = `${translate('checkout>checkoutInfo>hello')} ${
    orderResponse?.passShareCodeInfo?.data?.destinationUserName
  } ${translate('pass>sharedOrder>yourFriendSendGift', {
    friendName: profileName ?? '',
  })}, ${orderResponse?.passShareCodeInfo?.data?.message ?? ''} {sharedLink}`;

  const handleShared = (code: string) => {
    if (shareMessage) {
      copyToClipboard(
        shareMessage.replace(
          '{sharedLink}',
          `${window?.location?.protocol}//${window?.location?.hostname}/pass/share/${code}`
        )
      );
    } else {
      copyToClipboard('link');
    }
    setTimeout(() => setIsCopied(false), 3000);
  };

  const onRenderGiftsCard = () => {
    if (
      orderResponse?.passShareCodeInfo?.data?.destinationUserEmail ===
      profileEmail
    )
      return (
        <div className="pw-flex pw-flex-col pw-gap-2">
          {statusResponse?.passShareCodeInfo?.codes?.map((code) => (
            <SharedOrder
              key={code?.code}
              initialStep={2}
              shareCode={code?.code}
            />
          ))}
        </div>
      );
    else
      return (
        <div className="pw-my-5 pw-flex pw-flex-wrap pw-gap-8">
          <div className="pw-w-full pw-max-w-[500px] pw-shadow-lg pw-flex pw-flex-col pw-items-center pw-p-6 pw-rounded-xl pw-border pw-border-[#E6E8EC]">
            <p className="pw-text-[18px] pw-font-[700] pw-text-[#35394C]">
              {productCache?.choosedPayment?.paymentMethod === 'transfer'
                ? translate('checkout>checkoutInfo>paymentAnalysis')
                : translate('checkout>checkoutInfo>purchaseSucess')}
            </p>
            <div className="pw-w-full pw-max-w-[386px] pw-mt-5 pw-flex pw-flex-col pw-items-center pw-text-black">
              {statusResponse?.passShareCodeInfo?.codes?.map((code) => (
                <div
                  key={code?.code}
                  className="pw-w-full pw-max-w-[386px] pw-mt-5 pw-flex pw-flex-col pw-items-center pw-border pw-border-[#E6E8EC] pw-p-5 pw-rounded-[20px]"
                >
                  <img
                    className="pw-mt-6 pw-w-[250px] pw-h-[250px] pw-object-contain pw-rounded-lg sm:pw-w-[300px] sm:pw-h-[300px]"
                    src={
                      statusResponse?.products?.[0]?.productToken?.product
                        ?.images?.[0]?.thumb
                    }
                    alt=""
                  />
                  <p className="pw-mt-3 pw-font-semibold">{'Gift Card'}</p>
                  <p className="pw-mt-1 pw-text-[32px] pw-font-bold pw-mb-5">
                    {'R$'}
                    {(
                      parseFloat(orderResponse?.totalAmount) /
                      (statusResponse?.passShareCodeInfo?.codes?.length ?? 1)
                    ).toFixed(2) ?? ''}
                  </p>
                  <div className="pw-w-full pw-flex pw-flex-col pw-gap-[15px]">
                    <p className="pw-mt-4 pw-font-bold pw-text-center">
                      {translate('checkout>checkoutInfo>sendToFriend')}
                    </p>
                    <a
                      target="_blank"
                      className="pw-text-center !pw-py-3 !pw-px-[42px] !pw-bg-[#295BA6] !pw-text-xs !pw-text-[#FFFFFF] pw-border pw-border-[#295BA6] !pw-rounded-full hover:pw-bg-[#295BA6] hover:pw-shadow-xl disabled:pw-bg-[#A5A5A5] disabled:pw-text-[#373737] active:pw-bg-[#EFEFEF]"
                      href={
                        isMobile
                          ? `whatsapp://send?text=${encodeURIComponent(
                              `${shareMessage.replace(
                                '{sharedLink}',
                                `${window?.location?.protocol}//${window?.location?.hostname}/pass/share/${code?.code}`
                              )}`
                            )}`
                          : `https://api.whatsapp.com/send?text=${encodeURIComponent(
                              `${shareMessage.replace(
                                '{sharedLink}',
                                `${window?.location?.protocol}//${window?.location?.hostname}/pass/share/${code?.code}`
                              )}`
                            )}`
                      }
                      data-action="share/whatsapp/share"
                      rel="noreferrer"
                    >
                      {'Whatsapp'}
                    </a>
                    <PixwayButton
                      onClick={() => {
                        setIsCopied(true);
                        handleShared(code?.code ?? '');
                      }}
                      style={{
                        backgroundColor: '#0050FF',
                        color: 'white',
                      }}
                      className="!pw-py-3 !pw-px-[42px] !pw-bg-[#EFEFEF] !pw-text-xs !pw-text-[#383857] pw-border pw-border-[#DCDCDC] !pw-rounded-full hover:pw-bg-[#EFEFEF] hover:pw-shadow-xl disabled:pw-bg-[#A5A5A5] disabled:pw-text-[#373737] active:pw-bg-[#EFEFEF]"
                    >
                      {isCopied
                        ? translate('components>menu>copied')
                        : translate('affiliates>referrakWidget>shared')}
                    </PixwayButton>
                  </div>
                </div>
              ))}
              <p className="pw-mt-3 pw-font-bold pw-text-base pw-text-center">{`Olá, ${orderResponse?.passShareCodeInfo?.data?.destinationUserName}`}</p>
              <p className="pw-font-semibold pw-text-base pw-text-center">
                {translate('pass>sharedOrder>yourFriendSendGift', {
                  friendName: profileName ?? '',
                })}
              </p>
              <p className="pw-mt-3 pw-text-base pw-text-center pw-h-[72px]">
                {orderResponse?.passShareCodeInfo?.data?.message}
              </p>
            </div>
          </div>
        </div>
      );
  };

  return { isCopied, onRenderGiftsCard };
}
