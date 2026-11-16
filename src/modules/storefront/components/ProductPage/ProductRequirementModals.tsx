import { Alert } from '../../../shared/components/Alert';
import { ModalBase } from '../../../shared/components/ModalBase';
import { Spinner } from '../../../shared/components/Spinner';
import useTranslation from '../../../shared/hooks/useTranslation';

interface ProductRequirementModalsProps {
  cartOpen: boolean;
  isOpenRefresh: boolean;
  onCloseRefresh: () => void;
  isOpen: boolean;
  onClose: () => void;
  isFetching: boolean;
  product: {
    requirements?: {
      requirementModalPendingContent?: string;
      requirementModalContent?: string;
      requirementModalNoPurchaseAvailable?: string;
      productId?: string;
    };
  } | undefined;
  userHasIntegration: boolean;
  descriptionTextColor?: string;
  onRefreshAndIntegrate: () => void;
}

export const ProductRequirementModals = ({
  cartOpen,
  isOpenRefresh,
  onCloseRefresh,
  isOpen,
  onClose,
  isFetching,
  product,
  userHasIntegration,
  descriptionTextColor,
  onRefreshAndIntegrate,
}: ProductRequirementModalsProps) => {
  const [translate] = useTranslation();
  const textColor = descriptionTextColor ?? 'black';

  return (
    <>
      {cartOpen && (
        <Alert variant="success" className="!pw-gap-3 pw-sticky pw-top-0">
          <Alert.Icon />
          {translate('storefront>productPage>addProductInCart')}
        </Alert>
      )}
      <ModalBase isOpen={isOpenRefresh} onClose={onCloseRefresh}>
        <div className="pw-flex pw-flex-col pw-justify-center pw-items-center">
          <Spinner className="pw-mb-4" />
          <div
            style={{ color: textColor }}
            className="pw-text-[13px] pw-mt-6"
            dangerouslySetInnerHTML={{
              __html:
                product?.requirements?.requirementModalPendingContent ??
                'Estamos aguardando a confirmação do vinculo. <br/><br/> Esse processo pode levar até 5 minutos após a compra do título.',
            }}
          />
        </div>
      </ModalBase>
      <ModalBase isOpen={isOpen} onClose={onClose}>
        {isFetching ? (
          <Spinner />
        ) : (
          <>
            <div
              style={{ color: textColor }}
              className="pw-text-[13px] pw-pb-8 pw-mt-10"
              dangerouslySetInnerHTML={{
                __html:
                  product?.requirements?.productId === '' && userHasIntegration
                    ? (product?.requirements
                        ?.requirementModalNoPurchaseAvailable ?? '')
                    : (product?.requirements?.requirementModalContent ?? ''),
              }}
            />
            <div className="pw-flex sm:pw-flex-row pw-flex-col pw-justify-around">
              {!(product?.requirements?.productId === '' && userHasIntegration) && (
                <button
                  style={{ backgroundColor: '#0050FF', color: 'white' }}
                  className="pw-py-[10px] pw-px-[60px] pw-font-[500] pw-text-xs pw-mt-3 pw-rounded-full sm:pw-w-[160px] pw-w-full pw-shadow-[0_2px_4px_rgba(0,0,0,0.26)] pw-mr-4"
                  onClick={onRefreshAndIntegrate}
                >
                  {translate('components>advanceButton>continue')}
                </button>
              )}
              <button
                style={{ backgroundColor: 'white', color: 'black' }}
                className="pw-py-[10px] pw-px-[60px] pw-font-[500] pw-text-xs pw-mt-3 pw-rounded-full sm:pw-w-[160px] pw-w-full pw-shadow-[0_2px_4px_rgba(0,0,0,0.26)]"
                onClick={onClose}
              >
                {translate('components>walletIntegration>close')}
              </button>
            </div>
          </>
        )}
      </ModalBase>
    </>
  );
};
