import { useState, useCallback } from 'react';

export const useCodeInput = () => {
  const [inputs, setInputs] = useState(['', '', '', '', '', '']);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const changeInput = useCallback((index: number, e: any) => {
    setInputs((prev) => {
      const next = [...prev];
      next[index] = e.target.value;
      return next;
    });
    if (e.nativeEvent.inputType !== 'deleteContentBackward') {
      const next = document.getElementById(`input-${index + 1}`);
      next?.focus();
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleKeyUp = useCallback((e: any, index: number) => {
    if (e.code === 'Backspace') {
      setInputs((prev) => {
        if (prev[index] === '') {
          const previous = document.getElementById(`input-${index - 1}`);
          previous?.focus();
        }
        return prev;
      });
    }
  }, []);

  const code = inputs.join('');
  const isComplete = inputs.every((i) => i !== '');

  const reset = useCallback(() => {
    setInputs(['', '', '', '', '', '']);
  }, []);

  return { inputs, changeInput, handleKeyUp, code, isComplete, reset };
};
