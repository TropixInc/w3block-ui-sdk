import { useRef } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { Trans } from 'react-i18next';
import { ModalBase } from '../../shared/components/ModalBase';
import { PixwayButton } from '../../shared/components/PixwayButton';
import { Checkbox } from '../../shared/components/Checkbox';
import useTranslation from '../../shared/hooks/useTranslation';
interface Tokens {
  id: string;
  number: string;
}

interface Props {
  tokens: Array<Tokens>;
  collectionName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dontShowAgain: boolean) => void;
}

interface Form {
  iAgreeCheckbox: boolean;
  dontShowAgainCheckbox: boolean;
}

export const TokenTransferProcessModal = ({
  isOpen,
  onClose,
  onConfirm,
  tokens,
  collectionName,
}: Props) => {
  const iAgreeCheckboxRef = useRef<HTMLButtonElement>(null);
  const dontShowAgainCheckboxRef = useRef<HTMLButtonElement>(null);
  const [translate] = useTranslation();

  const methods = useForm<Form>({
    defaultValues: {
      iAgreeCheckbox: false,
      dontShowAgainCheckbox: false,
    },
  });

  const { iAgreeCheckbox } = useWatch({
    control: methods.control,
  });

  const handleConfirm = () => {
    onConfirm(methods.getValues('dontShowAgainCheckbox'));
  };

  const commaSeparatedTokens = tokens.map((token) => token.number).join(', ');
  const tokenName = `${collectionName} - ${commaSeparatedTokens}`;

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      classes={{
        dialogCard: '!pw-p-0 !pw-max-w-[650px] !pw-w-full',
      }}
    >
      <div className="pw-max-h-[calc(100vh_-_80px)] pw-p-[64px_75px_56px] pw-flex pw-flex-col pw-text-[#000000]">
        <h2 className="pw-text-xl pw-leading-[30px] pw-mb-10 pw-font-medium pw-self-center pw-shrink-0">
          {translate('wallet>tokenTransferProcessModal>title')}
        </h2>
        <div className="pw-flex pw-flex-col pw-overflow-y-auto pw-mb-[24px]">
          <p className="pw-text-base pw-leading-[140%] pw-mb-10">
            <Trans
              i18nKey={'wallet>tokenTransferProcessModal>p1'}
              tOptions={{
                tokenName: tokenName,
              }}
            >
              Caro usuário, você está prestes a fazer a transferência do seu
              token <i>{tokenName}</i> para uma carteira externa e para que tudo
              ocorra
              <span className="pw-font-semibold">rede Polygon</span>, a mesma
              rede que o token está custodiado, caso contrário seu token será
              perdido no meio deste processo.
            </Trans>
          </p>
          <p className="pw-text-base pw-leading-[140%] pw-mb-10">
            {translate('wallet>tokenTransferProcessModal>p2')}
          </p>
          <p className="pw-text-base pw-leading-[140%] pw-mb-0">
            {translate('wallet>tokenTransferProcessModal>p3')}
          </p>
        </div>
        <div className="pw-flex pw-flex-col pw-shrink-0">
          <FormProvider {...methods}>
            <div className="pw-flex pw-items-center pw-gap-x-[8px] pw-mb-6">
              <Checkbox name="iAgreeCheckbox" ref={iAgreeCheckboxRef} />
              <span
                className="pw-text-black pw-font-medium pw-text-sm pw-leading-4 pw-cursor-pointer pw-select-none"
                onClick={() => iAgreeCheckboxRef.current?.click()}
              >
                {translate('wallet>tokenTransferProcessModal>iAgreeCheckbox')}
              </span>
            </div>
            <div className="pw-flex pw-items-center pw-gap-x-[8px] pw-mb-10">
              <Checkbox
                name="dontShowAgainCheckbox"
                ref={dontShowAgainCheckboxRef}
              />
              <span
                className="pw-text-black pw-font-medium pw-text-sm pw-leading-4 pw-cursor-pointer pw-select-none"
                onClick={() => dontShowAgainCheckboxRef.current?.click()}
              >
                {translate(
                  'wallet>tokenTransferProcessModal>dontShowAgainCheckbox'
                )}
              </span>
            </div>

            <PixwayButton
              onClick={handleConfirm}
              className="!pw-bg-[#5682C3] !pw-text-sm !pw-leading-4 pw-self-center !pw-py-3 pw-min-w-[200px] disabled:!pw-text-white disabled:!pw-bg-[#CCCCCC]"
              disabled={!iAgreeCheckbox}
            >
              {translate('wallet>tokenTransferProcessModal>proceedButton')}
            </PixwayButton>
          </FormProvider>
        </div>
      </div>
    </ModalBase>
  );
};
