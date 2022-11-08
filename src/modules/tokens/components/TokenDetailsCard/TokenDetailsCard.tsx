import classNames from 'classnames';

import useTranslation from '../../../shared/hooks/useTranslation';
import { FormConfigurationContext } from '../../contexts/FormConfigurationContext';
import useDynamicDataFromTokenCollection from '../../hooks/useDynamicDataFromTokenCollection';
import {
  Dimensions2DValue,
  Dimensions3DValue,
} from '../../interfaces/DimensionsValue';
import { DynamicFormConfiguration } from '../../interfaces/DynamicFormConfiguration';
import { SmartDataDisplayer } from '../SmartDataDisplayer';
import { TextFieldDisplay } from '../SmartDisplay/TextFieldDisplay';

interface Props {
  contract: string;
  title: string;
  description: string;
  mainImage: string;
  tokenData: Record<string, string | Dimensions2DValue | Dimensions3DValue>;
  tokenTemplate: DynamicFormConfiguration;
  className?: string;
}

export const TokenDetailsCard = ({
  contract,
  description,
  mainImage,
  title,
  tokenData,
  tokenTemplate,
  className = '',
}: Props) => {
  const [translate] = useTranslation();
  const dynamicData = useDynamicDataFromTokenCollection(
    tokenData,
    tokenTemplate
  );

  const renderTextValue = (label: string, value: string) => (
    <TextFieldDisplay label={label} value={value} inline />
  );

  return (
    <div
      className={classNames(
        className,
        'pw-flex pw-flex-col sm:pw-divide-y-[1px] pw-divide-[#D1D1D1] pw-p-[17px] sm:pw-p-6 pw-bg-white pw-relative pw-rounded-[20px] pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] pw-mx-[22px] sm:pw-mx-0'
      )}
    >
      {title || contract ? (
        <div className="pw-flex pw-flex-col pw-gap-y-2 sm:pw-gap-y-6 pw-pb-6">
          {contract &&
            renderTextValue(
              translate('connect>tokenDetailsCard>contract'),
              contract
            )}
          {title &&
            renderTextValue(
              translate('connect>tokenDetailsCard>titleOrItemName'),
              title
            )}
        </div>
      ) : null}
      {mainImage || description ? (
        <div className="pw-grid pw-grid-cols-1 sm:pw-grid-cols-2 pw-gap-x-[21px] pw-gap-y-4 sm:pw-py-6 sm:pw-gap-y-8 pw-w-full pw-break-words">
          {description ? (
            renderTextValue(
              translate('connect>tokenDetailsCard>description'),
              description
            )
          ) : (
            <div className="pw-hidden sm:pw-block" />
          )}
          {!!mainImage && (
            <img
              src={mainImage}
              alt=""
              className="pw-w-[432px] pw-h-[351px] pw-object-contain pw-rounded-[20px] pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)]"
            />
          )}
        </div>
      ) : null}
      {dynamicData ? (
        <FormConfigurationContext.Provider value={tokenTemplate ?? {}}>
          <div className="pw-grid pw-grid-cols-1 sm:pw-grid-cols-2 pw-gap-x-[21px] pw-gap-y-8 sm:pw-gap-y-8 sm:pw-pt-6 pw-break-words">
            {dynamicData.map(({ id, value }: { id: any; value: any }) => (
              <SmartDataDisplayer
                fieldName={id}
                key={id}
                value={value}
                inline
                classes={{
                  label: 'pw-font-medium',
                }}
              />
            ))}
          </div>
        </FormConfigurationContext.Provider>
      ) : null}
    </div>
  );
};
