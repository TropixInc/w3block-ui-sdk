import classNames from 'classnames';
import Image from 'next/image';

import useIsMobile from '../../../../shared/hooks/useIsMobile/useIsMobile';
import TextFieldDisplay from '../../SmartDisplay/TextFieldDisplay';
import DisplayCardBase from '../DisplayCardBase';

interface Props {
  imageSrc: string;
  title: string;
  contract: string;
  description: string;
}

const PublicTokenInformationDisplayCard = ({
  imageSrc,
  contract,
  description,
  title,
}: Props) => {
  const isMobile = useIsMobile();
  const imageDimension = isMobile ? 296 : 380;
  return (
    <DisplayCardBase className="!pr-6 sm:!pr-8">
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-[69px]">
        <li
          className={classNames(
            'w-full flex flex-col gap-y-4',
            !imageSrc ? 'hidden sm:block' : ''
          )}
        >
          {imageSrc ? (
            <>
              <p className="font-medium">Imagem principal:</p>
              <Image
                alt="Main image"
                src={imageSrc}
                width={imageDimension}
                height={imageDimension}
              />
            </>
          ) : null}
        </li>

        <div className="flex flex-col gap-y-8">
          {title && (
            <li>
              <TextFieldDisplay label="Título ou nome do item" value={title} />
            </li>
          )}

          {contract && (
            <li>
              <TextFieldDisplay
                label="Contrato a ser utilizado"
                value={contract}
              />
            </li>
          )}

          {description && (
            <li>
              <TextFieldDisplay label="Descrição" value={description} />
            </li>
          )}
        </div>
      </ul>
    </DisplayCardBase>
  );
};

export default PublicTokenInformationDisplayCard;
