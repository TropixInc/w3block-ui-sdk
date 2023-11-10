import React, { useState, lazy } from 'react';
import { useTranslation } from 'react-i18next';

const OffpixButtonBase = lazy(() =>
  import(
    '../../../tokens/components/DisplayCards/OffpixButtonBase/OffpixButtonBase'
  ).then((m) => ({ default: m.OffpixButtonBase }))
);

interface RangeProps {
  onMutateRange: (value: {
    start: string | undefined;
    end: string | undefined;
  }) => void;
  onCloseFilters: (value: undefined) => void;
}

const NumberRange = ({ onMutateRange, onCloseFilters }: RangeProps) => {
  const [translate] = useTranslation();
  const [startRange, setStartRange] = useState<string>();
  const [endRange, setEndRange] = useState<string>();

  const handleConfirmRange = () => {
    onMutateRange({ start: startRange, end: endRange });
  };

  const handleCancelRange = () => {
    onMutateRange({ start: undefined, end: undefined });
    setEndRange(undefined);
    setStartRange(undefined);
    onCloseFilters(undefined);
  };

  return (
    <div className="pw-w-full pw-p-3 pw-border pw-shadow-sm">
      <div className="pw-w-full pw-flex pw-justify-around">
        <div className="pw-flex pw-gap-x-3 pw-items-center">
          <p className="pw-text-sm pw-font-medium">Min:</p>
          <input
            type="text"
            className="pw-w-16 pw-p-2 pw-rounded-md pw-h-8 pw-border pw-border-[#B9D1F3] pw-outline-none pw-text-sm pw-font-normal"
            value={startRange}
            onChange={(e) => setStartRange(e.target.value)}
          />
        </div>
        <div className="pw-flex pw-gap-x-3 pw-items-center">
          <p className="pw-text-sm pw-font-medium">Max:</p>
          <input
            type="text"
            className="pw-w-16 pw-p-2 pw-rounded-md pw-h-8 pw-border pw-border-[#B9D1F3] pw-outline-none pw-text-sm pw-font-normal"
            value={endRange}
            onChange={(e) => setEndRange(e.target.value)}
          />
        </div>
      </div>
      <div className="pw-w-full pw-flex pw-justify-around pw-mt-3">
        <OffpixButtonBase
          className="pw-px-6 !pw-py-1 pw-text-sm"
          variant="outlined"
          onClick={() => handleCancelRange()}
        >
          {translate('components>cancelButton>cancel')}
        </OffpixButtonBase>
        <OffpixButtonBase
          className="pw-px-6 !pw-py-1 pw-text-sm"
          onClick={() => handleConfirmRange()}
        >
          {translate('tokens>tokenBurnController>confirm')}
        </OffpixButtonBase>
      </div>
    </div>
  );
};

export default NumberRange;
