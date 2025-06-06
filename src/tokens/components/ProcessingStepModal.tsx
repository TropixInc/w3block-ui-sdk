import { ReactNode, lazy, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalBase } from '../../modules/shared/components/ModalBase';
import { PixwayButton } from '../../modules/shared/components/PixwayButton';
import { PixwayAppRoutes } from '../../modules/shared/enums/PixwayAppRoutes';
import { useTimedBoolean } from '../../modules/shared/hooks/useTimedBoolean';
import { PixwayLinkButton } from '../../modules/shared/components/PixwayLinkButton';



interface Props {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  linkText: string;
  linkHref: PixwayAppRoutes | string | (() => void);
  isSuccess: boolean;
  subTitle: string;
  alternateMessage?: ReactNode;
  error?: boolean;
}

export const ProcessingStepModal = ({
  isOpen,
  onClose,
  children,
  linkHref,
  linkText,
  isSuccess,
  subTitle,
  alternateMessage = null,
  error = false,
}: Props) => {
  const [translate] = useTranslation();
  const [messageIsHidden, hideMessage] = useTimedBoolean(3000);

  useEffect(() => {
    if (isOpen) {
      hideMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      classes={{
        dialogCard: '!pw-px-20 !pw-py-12',
      }}
    >
      <div>
        <div>
          <h1 className="pw-text-black pw-font-semibold pw-text-2xl pw-leading-7 pw-text-center pw-mb-6">
            {isSuccess
              ? translate('tokens>processingStepModal>allReady')
              : translate('tokens>processingStepModal>processing')}
          </h1>
          <h2 className="pw-text-black pw-text-sm pw-leading-4">
            {!isSuccess && subTitle}
          </h2>
          {children}
        </div>
        {error ? null : isSuccess ? (
          <PixwayButton
            type="button"
            className="!pw-text-[14px] pw-leading-4 pw-py-[6px]"
            onClick={onClose}
            fullWidth
          >
            OK
          </PixwayButton>
        ) : (
          <>
            {alternateMessage ? (
              alternateMessage
            ) : (
              <>
                {!messageIsHidden && (
                  <>
                    <p className="pw-text-sm pw-leading-4 pw-text-black pw-mb-6 pw-text-center">
                      {translate('tokens>processingStepModal>dontWorry')}
                    </p>
                    <div className="pw-w-full pw-flex">
                      {typeof linkHref === 'function' ? (
                        <PixwayButton
                          type="button"
                          className="!pw-text-[14px] pw-leading-4 pw-py-[6px]"
                          onClick={linkHref}
                          fullWidth
                        >
                          {linkText}
                        </PixwayButton>
                      ) : (
                        <PixwayLinkButton
                          href={linkHref}
                          variant="filled"
                          className="!pw-py-3 !pw-text-sm !pw-leading-4"
                          fullWidth
                        >
                          {linkText}
                        </PixwayLinkButton>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </ModalBase>
  );
};
