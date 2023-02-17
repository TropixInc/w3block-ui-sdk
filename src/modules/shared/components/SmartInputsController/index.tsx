import { KYCTypes } from '../../enums/KYCTypes';
import InputCpf from '../SmartInputs/InputCpf';
import InputEmail from '../SmartInputs/InputEmail';
import InputFile from '../SmartInputs/InputFile';
import InputPhone from '../SmartInputs/InputPhone';
import InputText from '../SmartInputs/InputText';
import InputUrl from '../SmartInputs/InputUrl';

interface SmartProps {
  type: KYCTypes;
  label: string;
  name: string;
}

const SmartInputsController = ({ label, name, type }: SmartProps) => {
  const renderInput = () => {
    switch (type) {
      case KYCTypes.CPF:
        return <InputCpf label={label} name={name} />;
      case KYCTypes.TEXT:
        return <InputText label={label} name={name} />;
      case KYCTypes.PHONE:
        return <InputPhone label={label} name={name} />;
      case KYCTypes.EMAIL:
        return <InputEmail label={label} name={name} />;
      case KYCTypes.URL:
        return <InputUrl label={label} name={name} />;
      case KYCTypes.FILE:
        return <InputFile label={label} name={name} />;
    }
  };
  return <div>{renderInput()}</div>;
};

export default SmartInputsController;
