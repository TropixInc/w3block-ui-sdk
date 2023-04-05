import { ReactComponent as CheckIcon } from '../../../assets/icons/checkCircledOutlined.svg';
import { ReactComponent as ErrorIcon } from '../../../assets/icons/x-circle.svg';

interface PropsInputStatus {
  invalid: boolean;
}

const InputStatus = ({ invalid }: PropsInputStatus) => {
  const renderStatus = () => {
    if (invalid) {
      return (
        <p className="pw-flex pw-items-center pw-gap-x-1">
          <ErrorIcon className="pw-stroke-[#ED4971] pw-w-3 pw-h-3" />
        </p>
      );
    } else {
      return (
        <p className="pw-flex pw-items-center pw-gap-x-1">
          <CheckIcon className="pw-stroke-[#18ee4d] pw-w-3 pw-h-3" />
          <p className="pw-text-sm pw-text-[#18ee4d]">Ok</p>
        </p>
      );
    }
  };
  return renderStatus();
};

export default InputStatus;
