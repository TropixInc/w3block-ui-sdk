import {
  breakpointsEnum,
  useBreakpoints,
} from '../../../shared/hooks/useBreakpoints/useBreakpoints';

const mobileBreakpoints = [breakpointsEnum.SM, breakpointsEnum.XS];

export const useMobilePreferenceDataWhenMobile: UseMobilePreferenceData = (
  desktopData,
  mobileData
) => {
  const breakpoint = useBreakpoints();
  return mobileBreakpoints.includes(breakpoint)
    ? { ...desktopData, ...mobileData }
    : desktopData;
};

type UseMobilePreferenceData = <T>(desktopData: T, mobileData: T) => T;
