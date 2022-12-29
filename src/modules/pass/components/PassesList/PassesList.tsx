import { useFlags } from 'launchdarkly-react-client-sdk';

import { InternalPagesLayoutBase } from '../../../shared';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { TokenListTemplateSkeleton } from '../../../tokens/components/TokensListTemplate/Skeleton';
import useGetPassByUser from '../../hooks/useGetPassByUser';
import { BaseTemplate } from '../BaseTemplate';
import { PassCard } from '../PassCard';

const _PassesList = () => {
  // const { data, isLoading } = useGetPassBenefits();
  const { data, isLoading } = useGetPassByUser();
  const benefits = data?.data.items;

  if (isLoading) return <TokenListTemplateSkeleton />;

  return (
    <BaseTemplate title="Token Pass">
      <div className="pw-flex-1 pw-flex pw-flex-col pw-justify-between pw-px-4 sm:pw-px-0">
        <ul className="pw-grid pw-grid-cols-1 lg:pw-grid-cols-2 xl:pw-grid-cols-3 pw-gap-x-[41px] pw-gap-y-[30px]">
          {benefits?.map((benefit) => {
            return (
              <li className="w-full" key={benefit.id}>
                <PassCard
                  id={benefit.id}
                  image={benefit.imageUrl || ''}
                  name={benefit.name}
                  contractAddress={benefit.contractAddress}
                  chainId={`${benefit.chainId}`}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </BaseTemplate>
  );
};

export const PassesList = () => {
  const { pass } = useFlags();
  return (
    <TranslatableComponent>
      <InternalPagesLayoutBase>
        {pass ? <_PassesList /> : null}
      </InternalPagesLayoutBase>
    </TranslatableComponent>
  );
};
