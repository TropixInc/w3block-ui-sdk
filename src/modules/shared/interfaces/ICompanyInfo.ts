interface HostInfo {
    hostname: string;
    isMain: true;
  }
  
  interface SignInConfigs {
    enabled: boolean;
    requireReferrer: boolean;
    callbackUri: string;
  }

export interface ICompanyInfo {
    id: string;
    name: string;
    info: unknown;
    hosts: HostInfo[];
    configuration?: {
      passwordless?: {
        enabled: boolean;
      };
      googleSignIn: SignInConfigs;
      appleSignIn: SignInConfigs;
    };
  }