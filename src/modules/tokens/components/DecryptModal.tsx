
import { ModalBase } from "../../shared/components/ModalBase";
import { WeblockButton } from "../../shared/components/WeblockButton";
import useTranslation from "../../shared/hooks/useTranslation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: any) => void;
}

export const DecryptModal = ({ isOpen, onClose, onSubmit }: Props) => {
  const [translate] = useTranslation();
  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      classes={{ classComplement: 'sm:!pw-max-w-full !pw-max-w-[90%]' }}
    >
      <p>{translate('tokens>decryptModal>insertYourKey')}</p>
      <form onSubmit={onSubmit}>
        <textarea
          className="pw-w-full pw-mb-4 pw-rounded-[7px] !pw-font-normal !pw-leading-[18px] pw-mt-1 !pw-outline-1 pw-border-[2px]"
          name="decryptedKey"
          id="decryptedKey"
          rows={10}
          cols={40}
        />
        <div className="pw-flex pw-flex-row pw-gap-3 pw-justify-between">
          <WeblockButton className="!pw-bg-white" onClick={onClose}>
            {translate('components>cancelMessage>cancel')}
          </WeblockButton>
          <WeblockButton className="pw-text-white" type="submit">
            {translate('tokens>decryptModal>decrypt')}
          </WeblockButton>
        </div>
      </form>
    </ModalBase>
  );
};
