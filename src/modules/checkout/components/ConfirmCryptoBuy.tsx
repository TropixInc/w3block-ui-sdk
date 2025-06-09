
import { lazy, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { metamaskErrors, ERROR_STATUS } from '../../core/metamask/providers/MetamaskProviderUiSDK';
import { CriptoValueComponent } from '../../shared/components/CriptoValueComponent';
import { PixwayButton } from '../../shared/components/PixwayButton';
import { Spinner } from '../../shared/components/Spinner';
import { WeblockButton } from '../../shared/components/WeblockButton';
import { CurrencyEnum } from '../../shared/enums/Currency';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { useProfile } from '../../shared/hooks/useProfile';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { useUserWallet } from '../../shared/hooks/useUserWallet/useUserWallet';
import { OrderPreviewCache, createOrderResponse } from '../interface/interface';
import { ErrorMessage } from './ErrorMessage';
import { useSocket } from '../../core/metamask/hooks/useSocket';
import { useMetamask } from '../../core/metamask/hooks/useMetamask';
import { useCheckout } from '../hooks/useCheckout';



enum BuyStatus {
  INITIAL,
  VALIDATING,
}

interface ConfirmCryptoBuyInterface {
  code?: CurrencyEnum;
  totalPrice: string;
  serviceFee?: string;
  gasPrice?: string;
  onClose?: () => void;
  orderInfo?: OrderPreviewCache;
}

export const ConfirmCryptoBuy = ({
  code = CurrencyEnum.MATIC,
  totalPrice,
  serviceFee,
  gasPrice,
  onClose,
  orderInfo,
}: ConfirmCryptoBuyInterface) => {
  const [status, setStatus] = useState<BuyStatus>(BuyStatus.INITIAL);
  const { mainWallet: wallet, hasWallet } = useUserWallet();
  const [err, setErr] = useState<any>();
  const [tryAgain, setTryAgain] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<any>();
  const [orderResponse, setOrderResponse] = useState<createOrderResponse>();
  const { signinRequest, emitTransactionCloncluded } = useSocket();
  const { sendSignedRequest, accounts, chainId } = useMetamask();
  const router = useRouterConnect();
  const { companyId, name } = useCompanyConfig();
  const [translate] = useTranslation();
  const { createOrder } = useCheckout();
  const { data: profile } = useProfile();
  const productChainId = useMemo(() => {
    if (orderInfo?.products.length) {
      return orderInfo?.products[0].chainId;
    } else return null;
  }, [orderInfo]);

  const canBuy = useMemo(
    () => parseFloat(wallet?.balance ?? '0') < parseFloat(totalPrice),
    [totalPrice, wallet]
  );
  useEffect(() => {
    if (
      signinRequest?.id == orderResponse?.providerTransactionId &&
      !tryAgain
    ) {
      sendTransaction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signinRequest]);

  const sendTransaction = () => {
    if (
      signinRequest &&
      orderResponse?.providerTransactionId == signinRequest.id
    ) {
      sendSignedRequest?.(signinRequest)
        .then((res: string) => {
          emitTransactionCloncluded?.(
            orderResponse?.providerTransactionId,
            res
          ).then(() => {
            router.pushConnect(
              PixwayAppRoutes.CHECKOUT_COMPLETED,
              router.query
            );
          });
        })
        .catch((e: any) => {
          if (e?.code === 'ACTION_REJECTED') {
            setErr(metamaskErrors.get(4001) ?? ERROR_STATUS.NO_MAPPED_ERROR);
            setErrMessage(
              'Para prosseguir com a compra, assine a transação da MetaMask após clicar no botão de comprar. '
            );
          } else {
            if (e.code) {
              setErr(
                metamaskErrors.get(e.code) ?? ERROR_STATUS.NO_MAPPED_ERROR
              );
            }
          }
          setTryAgain(true);
          setStatus(BuyStatus.INITIAL);
        });
    }
  };

  const [similarPayment, setSimilarPayment] = useState(false);

  const AllowSamePurchase = ({ onContinue }: { onContinue(): void }) => {
    const [agree, setAgree] = useState(false);
    return (
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
        <div className="pw-flex sm:pw-gap-3 pw-gap-2 pw-items-center pw-justify-center pw-my-5 ">
          <div
            onClick={() => {
              setAgree(!agree);
            }}
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
    );
  };

  const buyWithVault = (allowSimilarPayment?: boolean) => {
    if (
      wallet?.type == 'metamask' &&
      (window as any).ethereum?.selectedAddress?.toLowerCase() !=
        wallet?.address?.toLowerCase()
    ) {
      setErr('Conta selecionada não é a mesma da carteira');
      setErrMessage(
        'Para prosseguir com a compra, selecione a conta da carteira na MetaMask após clicar no botão de comprar. '
      );
      return;
    }

    if (
      wallet?.type == 'metamask' &&
      productChainId &&
      chainId &&
      productChainId != chainId
    ) {
      setErr(
        'A sua carteira MetaMask não está utilizando a rede do produto à venda.'
      );
      setErrMessage(
        'Por favor, altere a sua rede no MetaMask para a Polygon e tente novamente.'
      );
      return;
    }

    if (orderInfo && wallet?.balance && !canBuy) {
      setStatus(BuyStatus.VALIDATING);
      setErr(undefined);
      setErrMessage(undefined);
      if (
        tryAgain &&
        signinRequest?.id == orderResponse?.providerTransactionId &&
        wallet.type == 'metamask'
      ) {
        sendTransaction();
        return;
      }
      createOrder.mutate(
        {
          companyId,
          createOrder: {
            orderProducts: orderInfo.orderProducts,
            signedGasFee: orderInfo.signedGasFee,
            currencyId: orderInfo.currencyId,
            destinationWalletAddress: wallet?.address ?? '',
            acceptSimilarOrderInShortPeriod: allowSimilarPayment ?? false,
          },
        },
        {
          onSuccess(data: any) {
            setOrderResponse(data as unknown as createOrderResponse);
            if (wallet.type == 'vault') {
              router.pushConnect(
                PixwayAppRoutes.CHECKOUT_COMPLETED,
                router.query
              );
            }
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onError(e: any) {
            if (e?.message.includes('already have one pending order based')) {
              setErr(
                'Já existe uma compra aguardando a assinatura da metamask'
              );
              setErrMessage(
                'Para realizar esta nova compra, aguarde alguns minutos até a expiração da tentativa anterior e tente novamente.'
              );
            } else if (e?.errorCode === 'similar-order-not-accepted') {
              setSimilarPayment(true);
            } else {
              setErr('Erro inesperado');
              setErrMessage(
                'Tente executar novamente a operação caso o erro se repita entre em contato com o nosso suporte'
              );
            }

            setStatus(BuyStatus.INITIAL);
          },
        }
      );
    } else {
      router.pushConnect(PixwayAppRoutes.ADD_FUNDS_TYPE);
    }
  };

  const sameAccount = useMemo(
    () =>
      hasWallet && accounts?.toLowerCase() == wallet?.address?.toLowerCase(),
    [hasWallet, accounts, wallet?.address]
  );
  const sameChainId = hasWallet && productChainId == chainId;

  if (similarPayment) {
    return (
      <AllowSamePurchase
        onContinue={() => {
          setSimilarPayment(false);
          buyWithVault(true);
        }}
      />
    );
  }
  return (
    <div className="pw-flex pw-justify-center pw-flex-col pw-items-center">
      <p className="pw-text-[24px] pw-text-center pw-font-bold pw-text-black">
        {status == BuyStatus.INITIAL ? 'Comprar' : 'Validando'}
      </p>
      {status == BuyStatus.INITIAL ? (
        <>
          <div className="pw-w-full">
            <div className="pw-mt-[40px] pw-border pw-border-[#E6E8EC] pw-p-[14px] pw-flex pw-flex-col pw-w-full pw-rounded-lg">
              <p className="pw-text-sm pw-font-[500] pw-text-[#353945]">
                {profile?.data.mainWallet?.type == 'vault'
                  ? 'Carteira ' + name
                  : 'Carteira Metamask'}
              </p>
              <p className="pw-text-xs pw-text-[#3a3e48]">{wallet?.address}</p>
            </div>
            <div className="pw-px-3">
              <div className="pw-flex pw-gap-2 pw-w-ful pw-mt-1">
                <p className="pw-text-black pw-font-semibold pw-text-sm ">
                  {translate('header>logged>pixwayBalance')}:
                </p>
                <CriptoValueComponent
                  fontClass="pw-text-sm"
                  size={13}
                  value={wallet?.balance ?? '0'}
                  code={code}
                  crypto={true}
                />
              </div>
              {(!sameAccount || !sameChainId) && wallet?.type == 'metamask' && (
                <div className="pw-mt-4">
                  <ErrorMessage
                    title={
                      !sameAccount
                        ? 'A carteira Metamask selecionada não é a mesma que está vinculada a sua conta.'
                        : 'A sua carteira MetaMask não está utilizando a rede do produto à venda. '
                    }
                    message={
                      !sameAccount
                        ? `Por favor, utilize a carteira ${wallet.address} ou realize um novo cadastro utilizando a carteira atual.`
                        : 'Por favor, altere a sua rede no MetaMask para a Polygon e tente novamente.'
                    }
                  />
                </div>
              )}
              {}
              {hasWallet ? (
                canBuy && wallet?.balance ? (
                  <div className="pw-mt-4">
                    <ErrorMessage
                      title="Fundos insuficientes"
                      message="Para efetuar a compra é necessário adicionar fundos a sua carteira"
                    />
                  </div>
                ) : null
              ) : null}
              <div className="pw-w-full pw-h-px pw-bg-slate-300 pw-my-3"></div>

              <>
                <div className="pw-flex pw-justify-between">
                  <p className="pw-text-black pw-text-sm ">
                    {translate('shared>components>gasPriceinfo')}
                  </p>
                  <CriptoValueComponent
                    fontClass="pw-text-sm"
                    size={13}
                    value={gasPrice ?? '0'}
                    code={code}
                    crypto={true}
                  />
                </div>
                <div className="pw-flex pw-justify-between pw-mt-1">
                  <p className="pw-text-black pw-text-sm ">
                    {translate('shared>components>servicePriceinfo')}
                  </p>
                  <CriptoValueComponent
                    fontClass="pw-text-sm"
                    size={13}
                    value={serviceFee ?? '0'}
                    code={code}
                    crypto={true}
                  />
                </div>
                <div className="pw-flex pw-justify-between pw-mt-1">
                  <p className="pw-text-black pw-text-sm ">
                    {translate('shared>components>price&gasInfo')}
                  </p>
                  <CriptoValueComponent
                    fontClass="pw-text-sm"
                    size={13}
                    value={totalPrice ?? '0'}
                    code={code}
                    crypto={true}
                  />
                </div>
              </>
            </div>
          </div>
          {err && (
            <ErrorMessage
              className="pw-mt-4"
              title={err}
              message={errMessage}
            ></ErrorMessage>
          )}
          <WeblockButton
            // disabled={
            //   wallet?.type == 'metamask' && (!sameAccount || !sameChainId)
            // }
            onClick={() => buyWithVault()}
            tailwindBgColor={`${
              wallet?.type == 'metamask' && (!sameAccount || !sameChainId)
                ? 'pw-bg-[#E6E8EC]'
                : 'pw-bg-[#295BA6]'
            }`}
            className={`pw-w-full pw-mt-8 pw-text-white `}
          >
            {wallet?.balance && canBuy ? 'Adicionar fundos' : 'Comprar'}
          </WeblockButton>
          <WeblockButton
            onClick={onClose}
            tailwindBgColor="pw-bg-transparent"
            className="pw-w-full pw-mt-3 pw-text-slate-600 pw-bg-transparent pw-border !pw-border-slate-600 pw-shadow-none"
          >
            {translate('components>cancelMessage>cancel')}
          </WeblockButton>
        </>
      ) : (
        <>
          <Spinner className="pw-h-[40px] pw-w-[40px] pw-mt-10" />
          <p className="pw-w-[250px] pw-text-center pw-text-xs pw-text-slate-500 pw-mt-4 pw-mb-4">
            {translate('checkout>corfirmCryptoBuy>pleaseWaitTransiction')}
          </p>
        </>
      )}
    </div>
  );
};
