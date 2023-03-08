import { DataTypesEnum } from '@w3block/sdk-id';

import InputCpf from '../SmartInputs/InputCpf';
import InputEmail from '../SmartInputs/InputEmail';
import InputFile from '../SmartInputs/InputFile';
import InputPhone from '../SmartInputs/InputPhone';
import InputText from '../SmartInputs/InputText';
import InputUrl from '../SmartInputs/InputUrl';

interface SmartProps {
  type: DataTypesEnum;
  label: string;
  name: string;

  value?: string;

  assetId?: string | null;
}

const SmartInputsController = ({
  label,
  name,
  type,
  value,
  assetId,
}: SmartProps) => {
  const renderInput = () => {
    switch (type) {
      case DataTypesEnum.Cpf:
        return <InputCpf label={label} name={name} docValue={value} />;
      case DataTypesEnum.Text:
        return <InputText label={label} name={name} docValue={value} />;
      case DataTypesEnum.Phone:
        return <InputPhone label={label} name={name} docValue={value} />;
      case DataTypesEnum.Email:
        return <InputEmail label={label} name={name} docValue={value} />;
      case DataTypesEnum.Url:
        return <InputUrl label={label} name={name} docValue={value} />;
      case DataTypesEnum.File:
        return (
          <InputFile
            label={label}
            name={name}
            docValue={value}
            assetId={assetId}
          />
        );
    }
  };
  return <div>{renderInput()}</div>;
};

export default SmartInputsController;
