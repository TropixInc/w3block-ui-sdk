import useTranslation from '../../../../shared/hooks/useTranslation';
import TextFieldDisplay from '../TextFieldDisplay';

interface Props {
  trackWithRFID: boolean;
  RFIDCodes: Array<string>;
}

const RFIDFieldDisplay = ({ trackWithRFID, RFIDCodes }: Props) => {
  const [translate] = useTranslation();

  return (
    <div className="col-span-2">
      <TextFieldDisplay
        label="Rastrear o produto através de RFID?"
        value={trackWithRFID ? 'Sim' : 'Não'}
      />
      {trackWithRFID ? (
        <ul className="grid grid-cols-2 gap-y-4 gap-x-2.5 mt-4">
          {RFIDCodes.map((code, index) => (
            <TextFieldDisplay
              className="odd:pl-4"
              label={`Código do item #${(index + 1)
                .toFixed()
                .padStart(2, '0')}`}
              value={
                code !== ''
                  ? code
                  : translate('tokenization>creationStep>fieldNotFilledMessage')
              }
              key={`${code}-${index}`}
            />
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default RFIDFieldDisplay;
