import { ReactComponent as XIcon } from '../../assets/icons/xFilled.svg';

interface Props {
  onClose: () => void;
}

export const CloseButton = ({ onClose }: Props) => {
  return (
    <button
      onClick={onClose}
      className="pw-bg-white pw-rounded-full pw-shadow-[0px_0px_5px_rgba(0,0,0,0.25)] pw-w-8 pw-h-8 pw-absolute pw-right-4 pw-top-4 pw-flex pw-items-center pw-justify-center"
    >
      <XIcon className="pw-pw-fill-[#5682C3]" />
    </button>
  );
};
