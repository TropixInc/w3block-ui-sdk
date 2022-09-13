import { ReactNode, useEffect } from 'react';

import classNames from 'classnames';

import { useCountdown } from '../../../tokens/hooks/useCountdown';
import { ReactComponent as Clock } from '../../assets/icons/clockOutlined.svg';
import { ReactComponent as TooltipIcon } from '../../assets/icons/exclamationCircledOutlined.svg';
import { ReactComponent as Matic } from '../../assets/icons/maticFilled.svg';
import { ChainScan } from '../../enums/ChainId';
import { useBalance } from '../../hooks/useBalance';
import { useCompanyById } from '../../hooks/useCompanyById';
import { useCompanyConfig } from '../../hooks/useCompanyConfig/useCompanyConfig';
import { useCryptoCurrencyExchangeRate } from '../../hooks/useCryptoCurrencyExchangeRate';
import { useIsProduction } from '../../hooks/useIsProduction';
import { useModalController } from '../../hooks/useModalController';
import useTranslation from '../../hooks/useTranslation';
import { Alert } from '../Alert';
import { DialogBase } from '../DialogBase';
import { Spinner } from '../Spinner';
import { Tooltip } from '../Tooltip';

interface Props {
  title: string;
  subtitle: string;
  cancelButtonLabel: string;
  confirmButtonLabel: string;
  isCancelButtonDisabled?: boolean;
  isConfirmButtonDisabled?: boolean;
  children?: ReactNode;
  isOpen: boolean;
  gasPrice: number;
  gasPriceFound: boolean;
  gasPriceError: boolean;
  onCancel: () => void;
  onConfirm: (gasPrice: number) => void;
  onClose: () => void;
  refetch: () => void;
}

interface TaxLabelWithTooltipProps {
  label: string;
  tooltipContent: string;
  classes?: {
    root?: string;
    tooltip?: string;
    label?: string;
  };
}

const TaxLabelWithTooltip = ({
  label,
  tooltipContent,
  classes = {},
}: TaxLabelWithTooltipProps) => {
  const { closeModal, isOpen, openModal } = useModalController();

  return (
    <div
      className={classNames(
        'pw-flex pw-items-center pw-gap-x-1',
        classes.root ?? ''
      )}
    >
      <p
        className={classNames(
          'pw-font-semibold pw-text-sm pw-leading-5 pw-tracking-[0.4px] pw-text-[#353945]',
          classes.label ?? ''
        )}
      >
        {label}
      </p>
      <div
        className="pw-relative pw-flex pw-items-center pw-justify-center"
        onMouseLeave={closeModal}
      >
        <button
          onMouseEnter={openModal}
          onClick={isOpen ? closeModal : openModal}
          className="pw-outline-none"
          type="button"
        >
          <TooltipIcon className="pw-w-[14.7px] pw-h-[14.7px] pw-stroke-[#777E8F]" />
        </button>
        <Tooltip
          visible={isOpen}
          className="!pw-absolute !pw-bottom-[30px] pw-left-0 after:!pw-h-0"
          arrowPosition="bottom"
          classes={{
            content:
              '!pw-text-[#000000] !pw-ml-[-20px] !pw-font-medium pw-w-[195px]',
            arrow: 'after:!pw-left-[26px]',
          }}
        >
          {tooltipContent}
        </Tooltip>
      </div>
    </div>
  );
};

export const BlockchainGasTaxStepModal = ({
  subtitle,
  title,
  cancelButtonLabel,
  confirmButtonLabel,
  isCancelButtonDisabled,
  isConfirmButtonDisabled,
  children,
  isOpen,
  onCancel,
  onConfirm,
  onClose,
  gasPrice,
  gasPriceFound,
  gasPriceError,
  refetch,
}: Props) => {
  const isProduction = useIsProduction();
  const isDevelopment = !isProduction;
  const [translate] = useTranslation();
  const { companyId } = useCompanyConfig();
  const { data: companyResponse } = useCompanyById(companyId ?? '');
  const mainWalletAddress = companyResponse?.data.operatorAddress ?? '';
  const { data: balance, isSuccess: isBalanceSuccess } = useBalance({
    chainId: !isDevelopment ? ChainScan.POLYGON : ChainScan.MUMBAI,
    address: mainWalletAddress,
  });

  const insufficientFunds = Number(balance?.data.balance) <= gasPrice;

  const { data: cryptoCurrencyExchangeRate } =
    useCryptoCurrencyExchangeRate('MATIC');

  const ratesIsBRL = Number(cryptoCurrencyExchangeRate?.data.data.rates.BRL);
  const gasPriceInBRL = gasPrice * ratesIsBRL;

  const [counter, setCounter] = useCountdown();

  useEffect(() => {
    if (isOpen) {
      if (gasPrice === 0) {
        refetch();
      }
      setCounter(30);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (counter === 0) {
      refetch();
      setCounter(30);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter]);

  const renderMaticIcon = () => (
    <Matic className="pw-fill-[#8247E5] pw-w-[15px] pw-h-[13px]" />
  );

  const handleConfirm = () => {
    onConfirm(gasPrice);
  };

  const showData = gasPriceFound && isBalanceSuccess && !isNaN(gasPrice);
  const showGasError = gasPriceError || isNaN(gasPrice);

  return (
    <DialogBase
      cancelButtonText={cancelButtonLabel}
      confirmButtonText={confirmButtonLabel}
      isOpen={isOpen}
      onCancel={onCancel}
      onConfirm={handleConfirm}
      isCancelButtonDIsabled={isCancelButtonDisabled}
      isConfirmButtonDisabled={
        isConfirmButtonDisabled || !gasPriceFound || insufficientFunds
      }
      onClose={onClose}
      classes={{
        dialogCard: '!pw-px-20 !pw-py-0 !pw-max-h-[calc(100vh_-_80px)]',
        actionContainer:
          '!pw-justify-between !pw-gap-x-13 !pw-pb-12 pw-shrink-0',
        cancelButton: '!pw-py-3 pw-w-full',
        confirmButton: '!pw-py-3 pw-w-full',
      }}
    >
      <div className="pw-max-h-[calc(100vh_-_200px)] pw-flex pw-flex-col pw-mb-6 !pw-pt-12">
        <div className="pw-shrink-0">
          <h1 className="pw-text-black pw-font-semibold pw-text-2xl pw-leading-7 pw-text-center pw-mb-6">
            {title}
          </h1>
          <h2 className="pw-mb-6 pw-text-sm pw-leading-4 pw-text-black">
            {subtitle}
          </h2>
        </div>
        <div className="pw-overflow-y-auto pw-pr-1">
          {children}

          {showGasError ? (
            <Alert variant="error">
              <div className="pw-flex pw-items-center pw-gap-x-4 pw-mb-[6px]">
                <Alert.Icon />
                <p className="pw-font-semibold pw-text-sm pw-leading-4">
                  {translate('tokens>blockchainGasTaxStepModal>gasError')}
                </p>
              </div>
            </Alert>
          ) : (
            <>
              {showData ? (
                <>
                  <div>
                    <h2 className="pw-text-center pw-font-medium pw-text-sm pw-leading-4 pw-text-[#353945]">
                      {translate('tokens>blockchainGasTaxStepModal>taxTitle')}
                    </h2>

                    <div className="pw-mt-4 pw-mb-6">
                      <div className="pw-flex pw-justify-between pw-gap-x-2"></div>
                      <TaxLabelWithTooltip
                        label={translate(
                          'tokens>blockchainGasTaxStepModal>tax'
                        )}
                        tooltipContent={translate(
                          'tokens>blockchainGasTaxStepModal>taxTooltip'
                        )}
                        classes={{ root: 'pw-mb-2' }}
                      />
                      <div className="pw-flex pw-items-center pw-justify-between pw-mb-2">
                        <TaxLabelWithTooltip
                          label={translate(
                            'tokens>blockchainGasTaxStepModal>gasTax'
                          )}
                          tooltipContent={translate(
                            'tokens>blockchainGasTaxStepModal>gasTaxTooltip'
                          )}
                          classes={{
                            label: '!pw-font-medium !pw-text-[13px]',
                            tooltip: '!pw-max-w-[191px] pw-mb-2',
                          }}
                        />

                        <div className="pw-flex pw-items-center pw-gap-x-1">
                          <div className="pw-flex pw-items-center pw-gap-x-[5.42px]">
                            <Clock className="pw-stroke-[#5682C3] pw-w-[14px] pw-h-[14px]" />
                            <p className="pw-text-sm pw-leading-[21px] pw-min-w-[26px] pw-text-[#5682C3] pw-font-poppins">
                              {counter} s
                            </p>
                          </div>
                          <div className="pw-flex pw-items-center pw-gap-x-1">
                            {renderMaticIcon()}
                            <p className="pw-font-medium pw-text-[13px] pw-text-[#777E8F]">
                              {gasPrice}
                            </p>
                          </div>
                        </div>
                      </div>

                      <hr className="pw-w-full pw-mb-[8.58px]" />

                      <div className="pw-flex pw-items-start pw-justify-between">
                        <TaxLabelWithTooltip
                          label={translate(
                            'tokens>blockchainGasTaxStepModal>total'
                          )}
                          tooltipContent={translate(
                            'tokens>blockchainGasTaxStepModal>totalTooltip'
                          )}
                          classes={{
                            label: '!pw-font-bold',
                            tooltip: '!pw-max-w-[234px]',
                          }}
                        />
                        <div className="pw-flex pw-flex-col pw-gap-y-1 pw-items-end">
                          <div className="pw-flex pw-items-center pw-gap-x-1">
                            {renderMaticIcon()}
                            <p className="pw-text-[#202528] pw-text-sm pw-leading-[14px] pw-font-bold">
                              {gasPrice}
                            </p>
                          </div>
                          <p className="pw-font-normal pw-text-xs pw-leading-[17px] pw-text-[#777E8F]">
                            {gasPriceInBRL < 0.01
                              ? 'R$ 0,01'
                              : gasPriceInBRL.toLocaleString('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {insufficientFunds ? (
                    <div className="pw-mb-6">
                      <Alert
                        variant="error"
                        className="pw-flex pw-flex-col !pw-items-start !pw-px-6 pw-pt-[14px] pw-pb-6 pw-mb-6"
                      >
                        <div className="pw-flex pw-items-center pw-gap-x-2 pw-mb-[9.41px]">
                          <Alert.Icon />
                          <p className="pw-font-semibold pw-text-sm pw-leading-4 pw-text-[#D02428]">
                            {translate(
                              'tokens>blockchainGasTaxStepModal>insufficientFundsTitle'
                            )}
                          </p>
                        </div>
                        <p className="pw-max-w-[397px] pw-text-xs pw-leading-[18px] pw-text-[#333333] !pw-font-normal">
                          {translate(
                            'tokens>blockchainGasTaxStepModal>insufficientFunds'
                          )}
                        </p>
                      </Alert>
                      <p className="pw-text-sm pw-leading-4 pw-text-black pw-text-center">
                        {translate(
                          'tokens>blockchainGasTaxStepModal>confirmTheConversion'
                        )}
                      </p>
                    </div>
                  ) : (
                    <div className="pw-mb-6">
                      <Alert
                        variant="warning"
                        className="pw-flex pw-flex-col !pw-items-start !pw-px-6 pw-p-4 pw-mb-6"
                      >
                        <div className="pw-flex pw-items-center pw-gap-x-4 pw-mb-[6px]">
                          <Alert.Icon />
                          <p className="pw-font-semibold pw-text-sm pw-leading-4">
                            {translate(
                              'tokens>blockchainGasTaxStepModal>estimatedAlertTitle'
                            )}
                          </p>
                        </div>
                        <p className="pw-text-xs pw-leading-[16px] pw-text-black !pw-font-normal pw-pl-[34px]">
                          {translate(
                            'tokens>blockchainGasTaxStepModal>estimatedAlert'
                          )}
                        </p>
                      </Alert>
                    </div>
                  )}
                </>
              ) : (
                <Spinner className="!pw-border-t-[#5682C3] !pw-border-[#D1D1D1] pw-mx-auto pw-mb-6" />
              )}
            </>
          )}
        </div>
      </div>
    </DialogBase>
  );
};
