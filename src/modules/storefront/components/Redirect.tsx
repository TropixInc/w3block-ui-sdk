import { useDebounce } from 'react-use';

import { useTranslation } from 'react-i18next';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { useDynamicApi } from '../provider/DynamicApiProvider';
import { Spinner } from '../../shared/components/Spinner';
import TranslatableComponent from '../../shared/components/TranslatableComponent';



const _Redirect = () => {
  const router = useRouterConnect();
  const [translate] = useTranslation();
  const { datasource } = useDynamicApi();
  useDebounce(() => {
    if (datasource) {
      router.push(
        {path: `${router.basePath}/praticante/${datasource?.athlete?.data[0]?.attributes.slug}`}
      );
    }
  }, 6000);
  return (
    <div className="pw-h-[80vh] pw-flex pw-flex-col pw-justify-center pw-items-center">
      <>
        <h1 className="pw-font-bold pw-text-3xl pw-text-black pw-mb-5">
          {translate('shared>redirectTemplate>redirecting')}
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
