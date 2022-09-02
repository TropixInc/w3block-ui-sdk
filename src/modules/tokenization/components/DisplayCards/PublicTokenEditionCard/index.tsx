import { Editions } from '../../../enums/editions';
import TextFieldDisplay from '../../SmartDisplay/TextFieldDisplay';
import DisplayCardBase from '../DisplayCardBase';

interface Props {
  edition: Editions;
  total?: number;
  tokenEdition?: number;
  rfid?: string;
}

type EditionProps = Omit<Props, 'rfid'>;

const Edition = ({ edition, total, tokenEdition }: EditionProps) => {
  return (
    <div>
      <TextFieldDisplay label="Edição" value="Múltiplas" />
      {edition === Editions.MULTIPLE ? (
        <div className="flex flex-col gap-y-4 sm:grid sm:grid-cols-2">
          <TextFieldDisplay
            className="pl-6"
            label="Total de edições"
            value={`#${total?.toString().padStart(2, '0')}` ?? ''}
          />
          <TextFieldDisplay
            className="pl-6 sm:pl-0"
            label="Edição do token"
            value={`#${tokenEdition?.toString().padStart(2, '0')}` ?? ''}
          />
        </div>
      ) : null}
    </div>
  );
};

const PublicTokenDisplayCard = ({ rfid }: Props) => {
  return (
    <DisplayCardBase>
      <ul className="flex flex-col gap-y-8">
        <li>
          <Edition edition={Editions.MULTIPLE} tokenEdition={6} total={100} />
        </li>
        {rfid ? (
          <li>
            <TextFieldDisplay label="Código RFID / NFC" value={'123bG6gDf88'} />
          </li>
        ) : null}
      </ul>
    </DisplayCardBase>
  );
};

export default PublicTokenDisplayCard;
