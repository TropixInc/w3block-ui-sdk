import { useState } from 'react';
import { useBoolean } from 'react-use';

import { QrCodeReader } from '../../../shared/components/QrCodeReader';
import {
  QrCodeError,
  TypeError,
} from '../../../shared/components/QrCodeReader/QrCodeError';
import { QrCodeValidated } from '../../../shared/components/QrCodeReader/QrCodeValidated';
import useIsMobile from '../../../shared/hooks/useIsMobile/useIsMobile';
import useRouter from '../../../shared/hooks/useRouter';
import { useSessionUser } from '../../../shared/hooks/useSessionUser';
import usePostBenefitRegisterUse from '../../hooks/usePostBenefitRegisterUse';
import { BaseTemplate } from '../BaseTemplate';
import { TableBase } from '../TableBase';

export const PassesDetail = () => {
  const [showScan, setOpenScan] = useBoolean(false);
  const [showSuccess, setShowSuccess] = useBoolean(false);

  const router = useRouter();
  const passId = String(router.query.passId) || '';

  const { mutate: registerUse } = usePostBenefitRegisterUse();
  const user = useSessionUser();

  const dataMoked = [
    {
      id: '634226d67fbc9f9b3548aa9b',
      tokenId: '634226d64aa11c88c6a2305d',
      wallet: '634226d64aa11c88c6a2305d',
      status: 'Validado',
      document: '503.648.561-88',
      locale: '0a',
      name: 'Sophia West',
      date: '2022-04-11 11:06:45',
    },
    {
      id: '634226d6c18e1e6563af209e',
      tokenId: '634226d654cc82d7cb3208b4',
      wallet: '634226d654cc82d7cb3208b4',
      status: 'Erro',
      document: '793.805.783-59',
      locale: '1a',
      name: 'Velez Molina',
      date: '2022-04-08 07:23:17',
    },
  ];

  const [filteredData, setFilteredData] = useState(dataMoked);

  const validatePassToken = (secret: string) => {
    registerUse(
      {
        secret,
        tokenId: passId,
        userId: user?.id ?? '',
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
        },
      }
    );
  };

  const isMobile = useIsMobile();
  const title = isMobile
    ? ['Nome', 'Local', 'Token ID', '']
    : ['Benefício', 'Local', 'Período', 'Status', ''];

  return (
    <BaseTemplate title="Token Pass">
      <div className="pw-flex pw-flex-col pw-gap-8">
        <div className="pw-flex pw-items-center pw-justify-start pw-p-4 pw-gap-4 pw-border pw-border-[#E6E8EC] pw-rounded-2xl">
          <img
            className="pw-w-[216px] pw-h-[175px] pw-rounded-[20px] pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)]"
            src="https://res.cloudinary.com/tropix-dev/image/upload/v1661523975/offpix-backend/927657fe-ea7d-40b6-a957-ff5f38f27daf/bd5a829c-9a56-44a8-b394-4fd6b4ba07fb.jpg"
          />

          <div className="pw-w-[1px] pw-h-[175px] pw-bg-[#DCDCDC]" />

          <div className="pw-flex pw-flex-col pw-items-start pw-justify-center pw-gap-3">
            <h3 className="w-w-full pw-font-bold pw-text-lg pw-leading-[23px] pw-text-[#295BA6]">
              Nome do token Ze delivery
            </h3>
            <p className="pw-w-full pw-font-normal pw-text-[15px] pw-leading-[22.5px] pw-text-[#353945]">
              <span className="pw-font-bold">Descrição:</span> Lorem ipsum dolor
              sit amet, consectetur adipiscing elit. Nulla sit lectus ultricies
              et quis. Dis nullam lacus tincidunt vestibulum imperdiet in vitae
              elit. Maecenas eu, purus tortor nec lectus. Platea integer ac id
              sit. Diam libero quis praesent cum laoreet at eget sit. Sit et leo
              sed mi, commodo.
            </p>
          </div>
        </div>

        <TableBase columns={title} data={filteredData} />
      </div>

      <QrCodeReader
        hasOpen={showScan}
        setHasOpen={() => setOpenScan()}
        returnValue={(e) => validatePassToken(e)}
      />
      <QrCodeValidated
        hasOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        collectionId={passId}
      />
      <QrCodeError
        hasOpen={false}
        onClose={() => console.log('')}
        type={TypeError.use}
      />
    </BaseTemplate>
  );
};
