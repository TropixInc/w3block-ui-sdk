/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable i18next/no-literal-string */
import { useState } from 'react';
import { useCopyToClipboard } from 'react-use';

import _ from 'lodash';

import { AuthButton } from '../../auth/components/AuthButton';
import { ErrorBox } from '../../shared/components/ErrorBox';
import { Spinner } from '../../shared/components/Spinner';
import TranslatableComponent from '../../shared/components/TranslatableComponent';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { usePublicTokenData } from '../../tokens/hooks/usePublicTokenData';
import { useGetTokenSharedCode } from '../hooks/useGetTokenSharedCode';
import { QrCodeSection } from '../../tokens/components/PassTemplate/QrCodeSection';
import useTranslation from '../../shared/hooks/useTranslation';


const _SharedOrder = ({
  initialStep = 1,
  shareCode,
}: {
  initialStep?: number;
  shareCode?: string;
}) => {
  const router = useRouterConnect();
  const code = router?.query?.code ?? shareCode;
  const selfBuy = router?.query?.selfBuy?.includes('true') ? true : false;
  const [translate] = useTranslation();
  const [typeComponent, setTypeComponent] = useState(initialStep);
  const [isCopied, setIsCopied] = useState(false);
  const {
    data: pass,
    isLoading,
    refetch,
    error,
  } = useGetTokenSharedCode(
    code as string,
    initialStep === 2 && !selfBuy ? true : 5
  );
  const { data: publicTokenResponse, error: errorPublicToken } =
    usePublicTokenData({
      contractAddress: pass?.tokenPass?.contractAddress,
      chainId: pass?.tokenPass?.chainId,
      tokenId: pass?.editionNumber,
    });

  const [__, copyToClipboard] = useCopyToClipboard();
  const hasExpired =
    !pass?.benefits?.[0]?.secret ||
    pass?.benefits?.[0]?.statusMessage?.includes('ended the period of use');
  const renderComponent = (type: number) => {
    if (type === 1) {
      return (
        <div className="pw-flex pw-flex-col pw-items-center">
          {isLoading ? (
            <div className="pw-w-full pw-h-full pw-flex pw-flex-col pw-my-5 pw-gap-3 pw-justify-center pw-items-center">
              <p className="pw-text-base pw-font-semibold pw-text-center pw-text-black">
                {translate('pass>sharedOrder>waitLoadCode')}
              </p>
              <Spinner />
            </div>
          ) : (
            <>
              <p className="pw-font-bold pw-text-2xl pw-text-center">{`Olá, ${
                pass?.data?.destinationUserName ?? ''
              }`}</p>
              <p className="pw-mt-3 pw-font-semibold pw-text-base pw-text-center">
                {translate('pass>sharedOrder>yourFriendSendGift', {
                  friendName: pass?.user?.name ?? pass?.user?.email ?? '',
                })}
              </p>
              <p className="pw-mt-3 pw-text-base pw-text-center">
                {pass?.data?.message ?? ''}
              </p>
              <div className="pw-w-full pw-mt-5 pw-flex pw-flex-col pw-items-center pw-border pw-border-[#E6E8EC] pw-rounded-[20px]">
                <img
                  className="pw-mt-6 pw-w-[300px] pw-h-[300px] pw-object-contain pw-rounded-lg"
                  src={pass?.tokenPass?.imageUrl}
                  alt=""
                />
                <p className="pw-mt-3 pw-font-semibold">
                  {pass?.tokenPass?.name ?? ''}
                </p>
                <p className="pw-mt-1 pw-text-[32px] pw-font-bold pw-mb-5">
                  {pass?.tokenPass?.totalAmount ?? ''}
                </p>
              </div>
              <AuthButton
                onClick={() => setTypeComponent(2)}
                className="pw-mt-7 pw-w-full"
              >
                {translate('token>pass>benefits>useBenefit')}
              </AuthButton>
            </>
          )}
        </div>
      );
    } else if (type === 2) {
      return (
        <div className="pw-flex pw-flex-col pw-items-center">
          <p className="pw-font-bold pw-text-2xl">Gift card</p>
          <p className="pw-mt-2 pw-text-base pw-font-semibold pw-text-center">
            {translate('pass>sharedOrder>QRCode')}
          </p>
          <p className="pw-mt-6 pw-text-center pw-text-base">
            {translate('pass>sharedOrder>QRCodeUsage')}
          </p>
          <div className="pw-w-full pw-mt-5 pw-flex pw-flex-col pw-items-center pw-border pw-border-[#E6E8EC] pw-rounded-[20px]">
            {isLoading ? (
              <div className="pw-w-full pw-h-full pw-flex pw-flex-col pw-my-5 pw-gap-3 pw-justify-center pw-items-center">
                {!selfBuy ? (
                  <p className="pw-text-base pw-font-semibold pw-text-center pw-text-black">
                    {translate('pass>sharedOrder>codeAvaliableInFewMinutes')}
                  </p>
                ) : (
                  <p className="pw-text-base pw-font-semibold pw-text-center pw-text-black">
                    {translate('pass>sharedOrder>loadingCode')}
                  </p>
                )}
                <Spinner />
              </div>
            ) : (
              <QrCodeSection
                hasExpired={hasExpired}
                editionNumber={pass?.editionNumber as string}
                benefitId={pass?.benefits?.[0]?.id ?? ''}
                secret={pass?.benefits?.[0]?.secret ?? ''}
                isDynamic={pass?.benefits?.[0]?.dynamicQrCode ?? false}
                userId={pass?.user?.id}
                refetchSecret={refetch}
                size={150}
                rootClassnames="!pw-border-none"
                isRenderSecretCode={false}
              />
            )}
            {isLoading ? null : (
              <>
                {initialStep === 2 ? null : (
                  <div>
                    <p className="pw-mt-3 pw-text-[13px] pw-text-center">
                      {translate('pass>sharedOrder>nameUserPass')}
                    </p>
                    <p className="pw-text-center  pw-mb-3  pw-text-sm pw-font-semibold">
                      {pass?.data?.destinationUserName}
                    </p>
                  </div>
                )}
                <div>
                  <p className="pw-mb-0 pw-text-[13px] pw-text-center">
                    {translate('pass>sharedOrder>nameBuyer')}
                  </p>
                  <p className="pw-text-center pw-text-sm pw-font-semibold">
                    {pass?.user?.name ?? pass?.user?.email ?? ''}
                  </p>
                </div>
                {errorPublicToken ? (
                  <ErrorBox customError={errorPublicToken} />
                ) : (
                  <div>
                    <p className="pw-mt-3 pw-mb-0 pw-text-[13px] pw-text-center">
                      {
                        publicTokenResponse?.data?.dynamicInformation
                          ?.publishedTokenTemplate?.value?.config?.label
                      }
                    </p>
                    <p className="pw-text-center pw-text-sm pw-font-semibold pw-mb-8">
                      {(
                        publicTokenResponse?.data?.dynamicInformation
                          ?.publishedTokenTemplate?.value?.config as any
                      )?.options.find(
                        (val: any) => val.value === pass?.tokenMetadata?.value
                      )?.label ?? ''}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
          {initialStep === 2 ? (
            selfBuy ? null : (
              <p className="pw-text-base pw-font-semibold pw-text-center pw-text-black pw-mt-7">
                <button
                  onClick={() => {
                    copyToClipboard(
                      `${window?.location?.protocol}//${window?.location?.hostname}/pass/share/${code}?selfBuy=true`
                    );
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 3000);
                  }}
                  className="pw-underline pw-text-blue-600"
                >
                  {translate('pass>sharedOrder>copyLink')}
                </button>{' '}
                {translate('pass>sharedOrder>codeInFuture')}
              </p>
            )
          ) : (
            <AuthButton
              variant="outlined"
              onClick={() => setTypeComponent(1)}
              className="pw-mt-7 pw-px-10 !pw-bg-white"
            >
              {translate('components>walletIntegration>close')}
            </AuthButton>
          )}
          {isCopied && (
            <span className="pw-absolute pw-right-3 pw-top-5 pw-bg-[#E6E8EC] pw-py-1 pw-px-2 pw-rounded-md">
              {translate('components>menu>copied')}
            </span>
          )}
        </div>
      );
    }
  };

  return error ? (
    <ErrorBox customError={error} />
  ) : (
    <div className="pw-mt-10 pw-w-full pw-mb-8 pw-flex pw-justify-center pw-text-black">
      <div className="pw-mx-auto pw-w-[580px] pw-shadow-lg pw-border pw-border-[#dddddd71] pw-flex pw-justify-center pw-items-center pw-rounded-[20px] pw-p-8">
        {renderComponent(typeComponent)}
      </div>
    </div>
  );
};

export const SharedOrder = ({
  initialStep = 1,
  shareCode,
}: {
  initialStep?: number;
  shareCode?: string;
}) => {
  const router = useRouterConnect();
  const selfBuy = router?.query?.selfBuy?.includes('true') ? true : false;
  return (
    <TranslatableComponent>
      <_SharedOrder
        initialStep={selfBuy ? 2 : initialStep}
        shareCode={shareCode}
      />
    </TranslatableComponent>
  );
};
