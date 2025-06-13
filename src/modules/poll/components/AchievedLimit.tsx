import InfoIcon from '../../shared/assets/icons/informationCircledFilled.svg';

import { Box } from '../../shared/components/Box';
import useTranslation from '../../shared/hooks/useTranslation';

export const AchievedLimit = () => {
  const [translate] = useTranslation();
  return (
    <Box>
      <div className="flex pw-flex-col pw-items-center">
        <InfoIcon className="pw-w-[48px] pw-h-[48px]" />
        <p className="pw-text-center pw-text-[24px] pw-font-roboto pw-font-[700] pw-text-[#272727] pw-mt-3">
          {translate('poll>achievedLimit>noTokens')}
        </p>
        <p className="pw-text-center pw-text-[20px] pw-font-roboto pw-font-[700] pw-text-[#272727] pw-mt-6">
          {translate('poll>achievedLimit>textNoTokens')}
        </p>
      </div>
    </Box>
  );
};
