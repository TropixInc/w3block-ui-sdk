import { ChangeEvent, KeyboardEvent } from 'react';

interface CodeInputGridProps {
  inputs: string[];
  changeInput: (index: number, e: ChangeEvent<HTMLInputElement>) => void;
  handleKeyUp: (e: KeyboardEvent<HTMLInputElement>, index: number) => void;
}

export const CodeInputGrid = ({
  inputs,
  changeInput,
  handleKeyUp,
}: CodeInputGridProps) => {
  return (
    <div className="pw-flex pw-gap-x-2">
      {inputs.map((val: string, index: number) => (
        <input
          autoFocus={index == 0}
          onChange={(e) => changeInput(index, e)}
          maxLength={1}
          id={`input-${index}`}
          onKeyUp={(e) => handleKeyUp(e, index)}
          value={val}
          className="sm:pw-w-[50px] sm:pw-h-[50px] pw-w-[40px] pw-h-[40px] pw-rounded-lg pw-text-lg pw-px-2 pw-text-center pw-text-[#35394C] pw-font-[700] pw-border pw-border-[#295BA6]"
          key={index}
          type="tel"
        />
      ))}
    </div>
  );
};
