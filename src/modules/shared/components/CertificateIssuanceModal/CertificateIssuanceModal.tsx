import { lazy } from 'react';

import Link from 'next/link';
const ModalBase = lazy(() =>
  import('../../../shared/components/ModalBase').then((module) => ({
    default: module.ModalBase,
  }))
);

import useTranslation from '../../hooks/useTranslation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  contractAddress: string;
  chainId: number;
  tokenId: string;
}

export const CertificateIssuanceModal = ({
  isOpen,
  onClose,
  onConfirm,
  contractAddress,
  chainId,
  tokenId,
}: Props) => {
  const [translate] = useTranslation();

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      classes={{
        dialogCard: '!pw-w-full !pw-max-w-[650px] !pw-p-0',
      }}
    >
      <div className="pw-max-h-screen pw-flex pw-flex-col pw-items-center pw-justify-center !pw-p-[40px_32px_38px] sm:!pw-p-[64px_64px_56px]">
        <h2 className="pw-text-center pw-text-[#000000] pw-font-semibold pw-text-xl pw-leading-[30px] pw-mb-[33px]">
          {translate('components>certificateModal>title')}
        </h2>

        {/* <PDFViewer
          src={`${process.env.NEXT_PUBLIC_PDF_API_URL}certification/${contractAddress}/${chainId}/${tokenId}`}
        />
        <p className="pw-mt-4 pw-mb-10 pw-text-[13px] pw-leading-[15px]">
          Preview
        </p> */}
        <Link
          href={`${process.env.NEXT_PUBLIC_PDF_API_URL}certification/${contractAddress}/${chainId}/${tokenId}`}
        >
          <a
            onClick={onConfirm}
            className="pw-bg-[#5682C3] pw-rounded-lg pw-inline-block pw-text-white pw-text-base pw-leading-[19px] pw-text-center pw-font-semibold hover:pw-shadow-xl active:pw-bg-[#3663A6] pw-min-w-[260px] pw-p-3"
          >
            {translate('components>certificateModal>downloadButton')}
          </a>
        </Link>
      </div>
    </ModalBase>
  );
};
