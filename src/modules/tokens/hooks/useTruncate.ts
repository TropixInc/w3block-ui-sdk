import { useCallback } from 'react';

interface Config {
  maxCharacters: number;
}

const useTruncate = () => {
  return useCallback((text: string, { maxCharacters }: Config) => {
    if (text.length >= maxCharacters) {
      return text.slice(0, maxCharacters - 1).concat('...');
    }
    return text;
  }, []);
};

export default useTruncate;
