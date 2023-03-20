import {
  breakpointsEnum,
  useBreakpoints,
} from '../../../shared/hooks/useBreakpoints/useBreakpoints';

const mobileBreakpoints = [breakpointsEnum.SM, breakpointsEnum.XS];

export const useMergeMobileData: UseMergeMobileData = (
  desktopData,
  mobileData
) => {
  const breakpoint = useBreakpoints();
  return mobileBreakpoints.includes(breakpoint)
    ? { ...desktopData, ...mobileData }
    : desktopData;
};

type UseMergeMobileData = <T>(desktopData: T, mobileData: T) => T;
