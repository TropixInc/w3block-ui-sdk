import classNames from 'classnames';
import { format } from 'date-fns';

import { ReactComponent as ZoomInIcon } from '../../../shared/assets/icons/zoomInFilled.svg';
import { DisplayCardBase } from '../../../tokens/components/DisplayCards/DisplayCardBase';
import { PublicPageQRCode } from '../../../tokens/components/PublicPageQRCode';
import { QRCodeModal } from '../../../tokens/components/QRCodeModal';
import { TokenScanLink } from '../../../tokens/components/TokenScanLink';
import useModalController from '../../../tokens/hooks/useDialogController';
import { getPublicTokenPageURL } from '../../../tokens/utils/getPublicTokenPageURL';
import { useRouterConnect } from '../../hooks';
import useAdressBlockchainLink from '../../hooks/useAdressBlockchainLink/useAdressBlockchainLink';
import { useChainScanLink } from '../../hooks/useChainScanLink/useChainScanLink';
import useDateFnsLocale from '../../hooks/useDateFnsLocale/useDateFnsLocale';
import useTranslation from '../../hooks/useTranslation';

interface Props {
  chainId: number;
  mintedHash: string;
  contractAddress: string;
  rfid: string;
  tokenId: string;
  mintedAt: string;
  editionId: string;
  collectionName: string;
  totalEditions: number;
  editionNumber: number;
  className?: string;
}

export const MintedInfoCard = ({
  chainId,
  mintedHash,
  contractAddress,
  rfid,
  tokenId,
  mintedAt,
  editionId,
  collectionName,
  editionNumber,
  totalEditions,
  className = '',
}: Props) => {
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const locale = useDateFnsLocale();
  const {
    closeModal: closeQRCodeModal,
    isOpen: isQRCodeModalOpen,
    openModal: openQRCodeModal,
  } = useModalController();

  const chainScanLink = useChainScanLink(chainId, mintedHash);
  const addresBlockchainLink = useAdressBlockchainLink(
    chainId,
    contractAddress
  );

  const publicPageUrl = getPublicTokenPageURL({
    chainId: chainId,
    contractAddress: contractAddress,
    rfid: rfid,
    tokenId: tokenId,
  });

  return (
    <DisplayCardBase
      className={classNames(
        className,
        'pw-grid pw-grid-cols-1 sm:pw-grid-cols-2 pw-gap-x-[45px] pw-gap-y-4 pw-items-center sm:pw-justify-start pw-mx-[22px] sm:pw-mx-0 '
      )}
    >
      <div className="pw-w-full pw-flex pw-flex-col pw-items-center">
        <TokenScanLink
          label={translate('connect>tokenDetailsCard>tokenPublicPage')}
          href={router.routerToHref(publicPageUrl)}
          className="pw-justify-center sm:pw-justify-start pw-mb-4 sm:pw-mb-[11px] pw-font-medium"
        />
        <button
          className="pw-bg-white pw-p-2 pw-rounded-md pw-border pw-border-[#94B8ED] pw-flex pw-flex-col pw-gap-y-2 pw-items-center pw-mx-auto sm:pw-mx-0"
          onClick={openQRCodeModal}
        >
          <PublicPageQRCode
            size={140}
            contractAddress={contractAddress}
            chainId={chainId}
            tokenId={tokenId}
            rfid={rfid}
          />
          <ZoomInIcon className="pw-w-[18.6px] pw-h-[18px] pw-fill-[#5682C3]" />
        </button>
      </div>
      <div className="pw-flex pw-flex-col pw-gap-y-8">
        {chainScanLink && (
          <>
            <div className="pw-flex pw-flex-col pw-pw-gap-y-2">
              <TokenScanLink
                className="pw-font-medium"
                label={translate('components>genericMessages>mintedBy')}
                href={chainScanLink}
              />
              <p className="pw-leading-[19px] pw-text-[#676767]">
                {mintedAt &&
                  format(new Date(mintedAt), "dd LLLL, yyyy - HH'h'mm", {
                    locale,
                  })}
              </p>
            </div>

            <TokenScanLink
              label={translate(
                'tokenization>publicTokenTemplate>moreInfoThisNFT'
              )}
              className="pw-font-medium"
              href={addresBlockchainLink ?? ''}
            />
          </>
        )}
      </div>
      <QRCodeModal
        isOpen={isQRCodeModalOpen}
        onClose={closeQRCodeModal}
        selectedEdition={Number(editionNumber)}
        chainId={chainId}
        contractAddress={contractAddress}
        tokenId={tokenId}
        rfid={rfid}
        totalEditions={totalEditions ?? 0}
        collectionTitle={collectionName}
        editionId={editionId ?? ''}
      />
    </DisplayCardBase>
  );
};
