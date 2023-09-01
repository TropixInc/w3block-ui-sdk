import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { DynamicApiModuleInterface } from '../interfaces';

export interface DynamicApiContextInterface {
  config?: DynamicApiModuleInterface;
  datasource: any;
  isDynamic: boolean;
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
  useEffect(() => {
    if (dynamicModule) {
      dynamicModule.apis.forEach((api) => {
        makeApiCall(api.url, api.apiName);
      });
    }
  }, [dynamicModule]);

  const makeApiCall = async (url: string, apiName: string) => {
    const getIndex = new RegExp(/({\w+}*)/g).exec(url)?.length
      ? url.match(new RegExp(/({\w+})/g))
      : '';
    let newUrlApi = url;
    if (getIndex && getIndex.length > 0) {
      getIndex.forEach((item, index) => {
        newUrlApi = newUrlApi.replaceAll(item, dynamicModule?.matches[index]);
      });
    }

    const response = await fetch(newUrlApi);
    const data = await response.json();
    setDatasource((prev: any) => ({ ...prev, [apiName]: data }));
  };

  return (
    <DynamicApiContext.Provider
      value={{ datasource, isDynamic: dynamicModule != undefined }}
    >
      {children}
    </DynamicApiContext.Provider>
  );
};

export const useDynamicApi = () => {
  const context = useContext(DynamicApiContext);
  return { ...context };
};
