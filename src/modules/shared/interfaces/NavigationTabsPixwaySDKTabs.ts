export interface NavigationTabsPixwaySDKTabs {
    name: string;
    router?: string;
    tabs?: NavigationTabsPixwaySDKTabs[];
  }

  export interface NavigationTabsPixwaySDKProps {
    tabs?: NavigationTabsPixwaySDKTabs[];
    classNames?: NavigationTabsClassNames;
    signInRoute?: string;
    signUpRoute?: string;
    opened?: boolean;
    toogleMenu?: () => void;
    textColor?: string;
    hasSignUp?: boolean;
    fontFamily?: string;
    bgColor?: string;
    hasLogIn?: boolean;
    bgSelectionColor?: string;
    textSelectionColor?: string;
  }
  
  interface NavigationTabsClassNames {
    className?: string;
    tabClassName?: string;
  }