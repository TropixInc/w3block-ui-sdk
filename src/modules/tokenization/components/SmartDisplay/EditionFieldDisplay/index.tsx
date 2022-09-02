import { Editions } from '../../../enums/editions';
import TextFieldDisplay from '../TextFieldDisplay';

interface Props {
  edition: Editions;
  total: number;
  tokenQuantity: number;
}

const EditionFieldDisplay = ({ edition, tokenQuantity, total }: Props) => {
  const isMultipleEdition = edition === Editions.MULTIPLE;
  return (
    <div>
      <TextFieldDisplay
        label="Edição"
        value={isMultipleEdition ? 'Múltiplas' : 'Única'}
      />
      {isMultipleEdition ? (
        <div className="pl-6 mt-4">
          <TextFieldDisplay
            label="Total de edições"
            value={`#${total}`}
            className="mb-4"
          />
          <TextFieldDisplay
            label="Quantas serão tokenizadas"
            value={`#${tokenQuantity}`}
          />
        </div>
      ) : null}
    </div>
  );
};

export default EditionFieldDisplay;
