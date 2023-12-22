import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { DynamicApiModuleInterface } from '../interfaces';

export interface DynamicApiContextInterface {
  config?: DynamicApiModuleInterface;
  datasource: any;
  isDynamic: boolean;
  loading?: boolean;
}

const DynamicApiContext = createContext<DynamicApiContextInterface>({
  datasource: {},
  isDynamic: false,
});

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
      const makeApiCall = async (url: string, apiName: string) => {
        const getIndex = new RegExp(/{(\w+)}*/g).exec(url)?.length
          ? new RegExp(/{(\w+)}*/g).exec(url)?.slice(1)
          : '';
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
        setDatasource((prev: any) => ({ ...prev, [apiName]: data }));
      };

      if (dynamicModule?.apis.length) {
        setLoading(true);
        await Promise.all(
          dynamicModule?.apis.map(async (api) => {
            await makeApiCall(api.url, api.apiName);
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
