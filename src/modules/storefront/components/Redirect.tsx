import { lazy, useEffect } from 'react';

import { useRouterConnect } from '../../shared';
import TranslatableComponent from '../../shared/components/TranslatableComponent';
import { useDynamicApi } from '../provider/DynamicApiProvider';

const Spinner = lazy(() =>
  import('../../shared/components/Spinner').then((module) => ({
    default: module.Spinner,
  }))
);

const _Redirect = () => {
  const router = useRouterConnect();
  const { datasource } = useDynamicApi();
  useEffect(() => {
    if (datasource) {
      router.pushConnect(
        `${router.basePath}/praticante/${datasource?.athlete?.data[0]?.attributes.slug}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasource]);
  return (
    <div className="pw-h-[80vh] pw-flex pw-flex-col pw-justify-center pw-items-center">
      <>
        <h1 className="pw-font-bold pw-text-3xl pw-text-black pw-mb-5">
          Redirecionando
        </h1>
        <Spinner className="!pw-h-20 !pw-w-20" />
      </>
    </div>
  );
};

export const Redirect = () => {
  return (
    <TranslatableComponent>
      <_Redirect />
    </TranslatableComponent>
  );
};
