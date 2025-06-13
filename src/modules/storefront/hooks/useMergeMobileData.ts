import { breakpointsEnum } from "../../shared/enums/breakpointsEnum";
import { useBreakpoints } from "../../shared/hooks/useBreakpoints";


  
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
  