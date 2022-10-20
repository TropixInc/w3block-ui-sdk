import classNames from 'classnames';

import { InternalPagesLayoutBase } from '../../../shared';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import useRouter from '../../../shared/hooks/useRouter';
import useTranslation from '../../../shared/hooks/useTranslation';
import { usePublicTokenData } from '../../hooks/usePublicTokenData';
import { Breadcrumb } from '../Breadcrumb';
import { InternalPageTitle } from '../InternalPageTitle';

const _ListAllPass = () => {
  const router = useRouter();
  const [translate] = useTranslation();
  const contractAddress = (router.query.contractAddress as string) ?? '';
  const chainId = (router.query.chainId as string) ?? '';
  const tokenId = (router.query.tokenId as string) ?? '';
  const { data: publicTokenResponse } = usePublicTokenData({
    contractAddress,
    chainId,
    tokenId,
  });

  const breadcrumbItems = [
    {
      url: '/tokens',
      name: 'Meus Tokens',
    },
    {
      url: '',
      name: publicTokenResponse?.data?.information?.title ?? '',
    },
    {
      url: '',
      name: translate('connect>ListAllPass>listBenefits'),
    },
  ];
  return publicTokenResponse ? (
    <div
      className={classNames(
        'pw-flex pw-flex-col pw-p-[17px] sm:pw-p-6 pw-bg-white pw-relative pw-rounded-[20px] pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] pw-mx-[22px] sm:pw-mx-0'
      )}
    >
      <Breadcrumb breadcrumbItems={breadcrumbItems} />
      <InternalPageTitle
        contract={publicTokenResponse?.data?.information?.contractName}
        title={publicTokenResponse?.data?.information?.title}
      />
    </div>
  ) : null;
};

export const ListAllPass = () => (
  <TranslatableComponent>
    <InternalPagesLayoutBase>
      <_ListAllPass />
    </InternalPagesLayoutBase>
  </TranslatableComponent>
);
