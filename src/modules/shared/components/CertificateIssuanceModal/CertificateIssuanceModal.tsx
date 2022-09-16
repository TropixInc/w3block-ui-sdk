import { useMemo } from 'react';

import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';

import useTranslation from '../../hooks/useTranslation';
import { CertificatePdf } from '../CertificatePdf';
import { ModalBase } from '../ModalBase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  image: string;
  name: string;
  description: string;
  originalOwnerWalletAddress: string;
  transactionHash: string;
  contractAddress: string;
  QRCodeSrc: string;
}

export const CertificateIssuanceModal = ({
  isOpen,
  onClose,
  onConfirm,
  contractAddress,
  description,
  image,
  name,
  transactionHash,
  originalOwnerWalletAddress,
  QRCodeSrc,
}: Props) => {
  const [translate] = useTranslation();
  const translations = useMemo(
    () => ({
      QRCodeScanMessage: translate(
        'components>tokenCertificate>scanQRCodeMessage'
      ),
      collectionData: {
        titleLabel: translate(
          'components>tokenCertificate>collectionTitleLabel'
        ),
        descriptionLabel: translate(
          'components>tokenCertificate>collectionDescriptionLabel'
        ),
      },
      header: {
        line1: translate('components>tokenCertificate>headerLine1'),
        line2: translate('components>tokenCertificate>headerLine2'),
      },
      metaData: {
        contractAddressLabel: translate(
          'components>tokenCertificate>contractAddressLabel'
        ),
        transcationHashLabel: translate(
          'components>tokenCertificate>hashTransactionLabel'
        ),
      },
    }),
    [translate]
  );

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
        <PDFViewer
          width="100%"
          showToolbar={false}
          className="pw-drop-shadow-xl pw-h-[200px] lg:pw-h-[500px]"
        >
          <CertificatePdf
            translations={translations}
            imageSrc={image}
            QRCodeImageSrc={QRCodeSrc}
            contractAddress={contractAddress}
            ownerAddress={originalOwnerWalletAddress}
            transactionHash={transactionHash}
            name={name}
            description={description}
          />
        </PDFViewer>
        <p className="pw-mt-4 pw-mb-10 pw-text-[13px] pw-leading-[15px]">
          Preview
        </p>
        <PDFDownloadLink
          document={
            <CertificatePdf
              translations={translations}
              imageSrc={image}
              QRCodeImageSrc={QRCodeSrc}
              contractAddress={contractAddress}
              ownerAddress={originalOwnerWalletAddress}
              transactionHash={transactionHash}
              name={name}
              description={description}
            />
          }
          fileName="certificate.pdf"
          className="pw-bg-[#5682C3] pw-rounded-lg pw-inline-block pw-text-white pw-text-base pw-leading-[19px] pw-text-center pw-font-semibold hover:pw-shadow-xl active:pw-bg-[#3663A6] pw-min-w-[260px]"
        >
          {({ loading }) =>
            loading ? (
              <span className="pw-py-[9.5px] pw-px-[15px] pw-inline-block">
                {translate('components>certificateModal>loading')}
              </span>
            ) : (
              <span
                onClick={onConfirm}
                className="pw-py-[9.5px] pw-px-[15px] pw-inline-block"
              >
                {translate('components>certificateModal>downloadButton')}
              </span>
            )
          }
        </PDFDownloadLink>
      </div>
    </ModalBase>
  );
};
