import { ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/esm/locale';

import { useRouterConnect } from '../../../shared';
import { ReactComponent as ExternalLinkIcon } from '../../../shared/assets/icons/externalLink.svg';
import { ImageSDK } from '../../../shared/components/ImageSDK';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { ChainScan } from '../../../shared/enums/ChainId';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { usePublicTokenData } from '../../hooks/usePublicTokenData';
interface PublicTokenTemplateSDKProps {
  chainId?: string;
  tokenId?: string;
  contractAddress?: string;
}

const _PublicTokenTemplateSDK = ({
  chainId,
  tokenId,
  contractAddress,
}: PublicTokenTemplateSDKProps) => {
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const { companyId } = useCompanyConfig();
  const contractAddressQ = (router.query?.contractAddress as string) ?? '';
  const chainIdQ = (router.query?.chainId as string) ?? '';
  const tokenIdQ = (router.query?.tokenId as string) ?? '';
  const {
    data: publicTokenResponse,
    isSuccess,
    isLoading,
    isError,
  } = usePublicTokenData({
    contractAddress: contractAddress ?? contractAddressQ,
    chainId: chainId ?? chainIdQ,
    tokenId: tokenId ?? tokenIdQ,
  });

  useEffect(() => {
    if (
      isSuccess &&
      publicTokenResponse &&
      publicTokenResponse.data.company.id != companyId
    ) {
      router.pushConnect(PixwayAppRoutes.TOKENS);
    } else if (!isLoading && (isError || !publicTokenResponse)) {
      router.pushConnect(PixwayAppRoutes.TOKENS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isLoading]);

  const Title = ({ title }: { title: string }) => {
    return <p className="pw-font-roboto pw-font-[500]">{title}</p>;
  };

  const extractLink = () => {
    if (publicTokenResponse?.data?.token?.chainId === ChainScan.POLYGON)
      return `https://polygonscan.com/address/${publicTokenResponse?.data?.token?.address}`;
    if (publicTokenResponse?.data?.token?.chainId === ChainScan.MUMBAI)
      return `https://mumbai.polygonscan.com/address/${publicTokenResponse?.data?.token?.address}`;
    return '';
  };

  return (
    <div className="pw-min-h-[90%] pw-container pw-mx-auto pw-px-4 pw-py-10 ">
      <ContentArea title="Categoria do produto">
        <div className="pw-flex pw-flex-col sm:pw-flex-row pw-gap-4">
          <div className="pw-flex-1 pw-flex pw-gap-2">
            <Title title="Categoria:" />
            <p className="pw-font-roboto">
              {publicTokenResponse?.data?.group?.categoryName ?? ''}
            </p>
          </div>
          <div className="pw-flex-1 pw-flex pw-gap-2">
            <Title title="Subcategoria:" />
            <p className="pw-font-roboto">
              {publicTokenResponse?.data?.group?.subcategoryName ?? ''}
            </p>
          </div>
        </div>
      </ContentArea>
      <ContentArea title="Informações do token">
        <div className="pw-flex pw-flex-col sm:pw-flex-row pw-gap-4">
          <div className="pw-flex-1 pw-mr-6">
            <Title title="Imagem principal:" />
            <ImageSDK
              controls={true}
              src={publicTokenResponse?.data?.information?.mainImage ?? ''}
              className="pw-w-full pw-object-contain pw-mt-4 pw-max-h-[500px] pw-object-left-top"
              width={800}
              quality="eco"
            />
          </div>
          <div className="pw-flex-1">
            <Title title="Título ou nome do item:" />
            <p className="pw-font-roboto pw-mt-2 pw-mb-8">
              {publicTokenResponse?.data?.information?.title}
            </p>
            <Title title="Contrato a ser utilizado:" />
            <p className="pw-font-roboto pw-mt-2 pw-mb-8">
              {publicTokenResponse?.data?.information?.contractName}
            </p>
            <Title title="Descrição:" />
            <p className="pw-font-roboto pw-mt-2">
              {publicTokenResponse?.data?.information?.description}
            </p>
          </div>
        </div>
      </ContentArea>
      <ContentArea title="">
        <div className="pw-grid pw-grid-cols-2">
          {Object.keys(
            publicTokenResponse?.data?.dynamicInformation?.tokenData ?? {}
          ).map((key) => (
            <div key={key}>
              <Title
                title={
                  publicTokenResponse?.data?.dynamicInformation
                    ?.publishedTokenTemplate[key]?.config?.label + ':'
                }
              />
              <p className="pw-font-robto pw-mt-2 pw-mb-8">
                {publicTokenResponse?.data?.dynamicInformation?.tokenData[key]
                  ? (publicTokenResponse?.data?.dynamicInformation?.tokenData[
                      key
                    ] as string)
                  : ''}
              </p>
            </div>
          ))}
        </div>
      </ContentArea>
      <ContentArea title="">
        <div className="">
          <Title title="Edição:" />
          <p className="pw-font-roboto pw-mt-2">
            {publicTokenResponse?.data?.edition.isMultiple
              ? 'Multiplas'
              : 'Única'}
          </p>
          {publicTokenResponse?.data?.edition.isMultiple && (
            <div className="pw-flex pw-flex-col sm:pw-flex-row pw-gap-4 pw-mt-4">
              <div className="pw-flex-1 pw-pl-8">
                <Title title="Total de edições" />
                <p className="pw-font-roboto">
                  #{publicTokenResponse?.data?.edition.total}
                </p>
              </div>
              <div className="pw-flex-1 pw-pl-8">
                <Title title="Edição do token" />
                <p className="pw-font-roboto">
                  #{publicTokenResponse?.data?.edition.currentNumber}
                </p>
              </div>
            </div>
          )}
        </div>
      </ContentArea>
      <ContentArea title="Blockchain">
        <div className="pw-flex pw-flex-col sm:pw-flex-row pw-gap-4">
          <div className="pw-flex-1">
            <a
              target="_blank"
              href={extractLink()}
              className="pw-flex pw-gap-6 pw-items-center"
              rel="noreferrer"
            >
              <p className="pw-font-roboto pw-font-[500] pw-text-[#045CE0]">
                Mintado por W3block
              </p>
              <ExternalLinkIcon className="pw-stroke-[#045CE0]" />
            </a>
            <p className="pw-font-roboto pw-mt-2">
              {publicTokenResponse?.data?.edition?.mintedAt
                ? format(
                    new Date(publicTokenResponse.data.edition.mintedAt),
                    'PPpp',
                    { locale: ptBR }
                  )
                : ''}
            </p>
          </div>
          <div className="pw-flex-1">
            <a
              target="_blank"
              href={extractLink()}
              className="pw-flex pw-gap-6 pw-items-center"
              rel="noreferrer"
            >
              <p className="pw-font-roboto pw-font-[500] pw-text-[#045CE0]">
                {translate('connect>tokenDetailsCard>moreInformation')}
              </p>
              <ExternalLinkIcon className="pw-stroke-[#045CE0]" />
            </a>
          </div>
        </div>
      </ContentArea>
    </div>
  );
};

export const PublicTokenTemplateSDK = (props: PublicTokenTemplateSDKProps) => {
  return (
    <TranslatableComponent>
      <_PublicTokenTemplateSDK {...props} />
    </TranslatableComponent>
  );
};

const ContentArea = ({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) => {
  return (
    <div className="pw-mb-[32px]">
      <p className="pw-font-roboto pw-font-[500] pw-mb-4">{title}</p>
      <div className="pw-bg-[#ECF4FF] pw-w-full pw-py-4 pw-px-6 pw-rounded-lg">
        {children}
      </div>
    </div>
  );
};
