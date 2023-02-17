import AuthFormController from '../../../../auth/components/AuthFormController/AuthFormController';

interface InputText {
  label: string;
  name: string;
}

const InputText = ({ label, name }: InputText) => {
  return (
    <div>
      <AuthFormController label={label} name={name}>
        <input className="!pw-px-[10px] !pw-py-[14px] !pw-text-[13px] pw-rounded-md  pw-text-fill-[#353945] pw-text-base pw-leading-4 pw-font-normal pw-w-full pw-border-[#94B8ED] pw-border pw-outline-none pw-bg-transparent placeholder:!pw-text-[#777E8F]" />
      </AuthFormController>
    </div>
  );
};

export default InputText;
