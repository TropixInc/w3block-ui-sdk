import XIcon from '../../assets/icons/xFilled.svg?react';

interface Props {
  onClose: () => void;
  className?: string;
}

export const CloseButton = ({ onClose, className }: Props) => {
  return (
    <button
      onClick={onClose}
      className={`${
        className + ' '
      }pw-bg-white pw-rounded-full pw-shadow-[0px_0px_5px_rgba(0,0,0,0.25)] pw-w-8 pw-h-8 pw-absolute pw-right-4 pw-top-4 pw-flex pw-items-center pw-justify-center`}
    >
      <XIcon className="pw-pw-fill-[#5682C3]" />
    </button>
  );
};
