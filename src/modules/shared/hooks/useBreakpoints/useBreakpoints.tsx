import { useMemo } from 'react';
import { useMedia } from 'react-use';

export enum breakpointsEnum {
  XS,
  SM,
  LG,
  XL,
}

export const useBreakpoints = (): breakpointsEnum => {
  const isSm = useMedia('(min-width: 768px)');
  const isLg = useMedia('(min-width: 1024px)');
  const isXl = useMedia('(min-width: 1306px)');
  return useMemo(() => {
    if (isXl) {
      return breakpointsEnum.XL;
    } else if (isLg) {
      return breakpointsEnum.LG;
    } else if (isSm) {
      return breakpointsEnum.SM;
    } else {
      return breakpointsEnum.XS;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSm, isLg, isXl]);
};
