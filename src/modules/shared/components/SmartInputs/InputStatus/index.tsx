import { ReactComponent as CheckIcon } from '../../../assets/icons/checkCircledOutlined.svg';
import { ReactComponent as ErrorIcon } from '../../../assets/icons/x-circle.svg';

interface PropsInputStatus {
  invalid: boolean;
  errorMessage?: string;
}

const InputStatus = ({ invalid, errorMessage }: PropsInputStatus) => {
  const renderStatus = () => {
    if (invalid) {
      return (
        <p className="pw-flex pw-items-center pw-gap-x-1">
          <ErrorIcon className="pw-stroke-[#ED4971] pw-w-3 pw-h-3" />
          <span className="pw-text-[#ED4971] pw-text-xs">{errorMessage}</span>
        </p>
      );
    } else {
      return (
        <p className="pw-flex pw-items-center pw-gap-x-1">
          <CheckIcon className="pw-stroke-[#18ee4d] pw-w-3 pw-h-3" />
          <span className="pw-text-xs pw-text-[#18ee4d]">Ok</span>
        </p>
      );
    }
  };
  return renderStatus();
};

export default InputStatus;
