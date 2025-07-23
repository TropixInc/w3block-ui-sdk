import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { processLocalizations } from "../utils/processLocalizations";
import { DynamicApiModuleInterface } from "../interfaces/Theme";

export interface DynamicApiContextInterface {
  config?: DynamicApiModuleInterface;
  datasource: any;
  isDynamic: boolean;
  loading?: boolean;
  strapiLocalization?: boolean;
}

// Check if context already exists (for symlink development)
const globalKey = '__DYNAMIC_API_CONTEXT__';
declare global {
  interface Window {
    [key: string]: any;
  }
}

let context: React.Context<DynamicApiContextInterface>;

if (typeof window !== 'undefined' && window[globalKey]) {
  context = window[globalKey];
} else {
  context = createContext<DynamicApiContextInterface>({
    datasource: {},
    isDynamic: false,
  });
  if (typeof window !== 'undefined') {
    window[globalKey] = context;
  }
}

const DynamicApiContext = context;

interface DynamicApiProviderProps {
  children: ReactNode;
  dynamicModule?: DynamicApiModuleInterface;
}

export const DynamicApiProvider = ({
  children,
  dynamicModule,
}: DynamicApiProviderProps) => {
  const [datasource, setDatasource] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const getApis = useMemo(
    () => async () => {
      const makeApiCall = async (
        url: string,
        apiName: string,
        strapiLocalization?: boolean
      ) => {
        const getIndex = new RegExp(/{(\w+)}*/g).exec(url)?.length
          ? new RegExp(/{(\w+)}*/g).exec(url)?.slice(1)
          : "";
        let newUrlApi = url;
        if (getIndex && getIndex.length > 0) {
          getIndex.forEach((item) => {
            newUrlApi = newUrlApi.replaceAll(
              `{${item}}`,
              dynamicModule?.groups[item]
            );
          });
        }

        const response = await fetch(newUrlApi);
        const data = await response.json();
        if (strapiLocalization) {
          const reviewdData = processLocalizations(data?.data);
          setDatasource((prev: any) => ({
            ...prev,
            [apiName]: { ...data, data: reviewdData },
          }));
        } else {
          setDatasource((prev: any) => ({ ...prev, [apiName]: data }));
        }
      };

      if (dynamicModule?.apis.length) {
        setLoading(true);
        await Promise.all(
          dynamicModule?.apis.map(async (api) => {
            await makeApiCall(api.url, api.apiName, api.strapiLocalization);
          })
        );
        setLoading(false);
      } else setLoading(false);
    },
    [dynamicModule]
  );

  useEffect(() => {
    getApis();
    // dynamicModule.apis.forEach((api) => {
    //   makeApiCall(api.url, api.apiName);
    // });
  }, [getApis]);

  return (
    <DynamicApiContext.Provider
      value={{
        datasource,
        isDynamic: dynamicModule != undefined,
        config: dynamicModule,
        loading,
        strapiLocalization: dynamicModule?.apis?.[0]?.strapiLocalization,
      }}
    >
      {children}
    </DynamicApiContext.Provider>
  );
};

export const useDynamicApi = () => {
  const context = useContext(DynamicApiContext);
  return { ...context };
};
