import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { Trans } from 'react-i18next';
import { useDebounce, useToggle } from 'react-use';

import classNames from 'classnames';
import { format, getDay } from 'date-fns';

import { ReactComponent as FilterIcon } from '../../../shared/assets/icons/filterOutlined.svg';
import useIsMobile from '../../../shared/hooks/useIsMobile/useIsMobile';
import { useIsProduction } from '../../../shared/hooks/useIsProduction';
import useTranslation from '../../../shared/hooks/useTranslation';
import { BaseTemplate } from '../BaseTemplate';
import { TableBase } from '../TableBase';
import { dataMoked } from './dataMoked';

export const ClientTemplate = () => {
  const Lorem = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;
  const shortDay = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
  const token = {
    name: 'RIO World Skate Street World Championships',
    type: 'unique',
    id: '00000000000000000',
    image:
      'https://res.cloudinary.com/tropix-dev/image/upload/v1661523975/offpix-backend/927657fe-ea7d-40b6-a957-ff5f38f27daf/bd5a829c-9a56-44a8-b394-4fd6b4ba07fb.jpg',
    detail: {
      name: '0Lorem Ipsum is simply dummy text of the printing.',
    },
    address: {
      name: 'Nome do endereço',
      street: 'Praça da Tijuca Rio de Janeiro',
      city: 'RJ',
      country: 'Brazil',
      rules: Lorem,
      cabin: 'Camarote Bossa Nova',
    },
  };
  const event = {
    date: '10/20/2022 14:30',
  };

  const eventDate = new Date(event.date);
  const isMobile = useIsMobile();

  const title = isMobile
    ? ['Nome', 'ID', 'Local', '']
    : ['Nome', 'Documento', 'Token ID', 'Carteira', 'Data', 'Local', 'Status'];

  const isProduction = useIsProduction();
  const isDevelopment = !isProduction;
  const [filteredData, setFilteredData] = useState(dataMoked);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(Object.keys(Status));

  useDebounce(
    () => {
      const filter = searchTerm.toLowerCase();
      const filteredData = dataMoked.filter(
        (item) =>
          (item.name.toLowerCase().includes(filter) ||
            item.id.toLowerCase().includes(filter)) &&
          Boolean(
            statusFilter.find(
              (e) => e.toLowerCase() === item.status.toLowerCase()
            )
          )
      );

      setFilteredData(filteredData);
    },
    500,
    [searchTerm, statusFilter]
  );

  const handleStatusFilter = (filter: string) => {
    const filterLowerCase = filter.toLocaleLowerCase();
    const hasFilter = statusFilter.find(
      (e) => e.toLocaleLowerCase() === filterLowerCase
    );

    if (hasFilter) {
      const filtered = statusFilter.filter(
        (e) => e.toLocaleLowerCase() !== filterLowerCase
      );
      setStatusFilter(filtered);
    } else {
      setStatusFilter((e) => [...e, filter]);
    }
  };

  return isDevelopment ? (
    <BaseTemplate>
      <div className="pw-flex pw-flex-col pw-p-[16px] pw-gap-[24px] sm:pw-gap-[16px] pw-border pw-border-[#E6E8EC] pw-rounded-[16px]">
        <div className="pw-flex pw-flex-col sm:pw-flex-row pw-gap-[24px] sm:pw-gap-[16px]  pw-items-center">
          <div className="pw-w-[319px] sm:pw-w-[216px] pw-h-[265px] sm:pw-h-[175px] pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] pw-rounded-[20px] pw-overflow-hidden">
            <img
              src={token.image}
              alt={token.name}
              className="pw-w-full pw-h-full"
            />
          </div>

          <div className="pw-flex pw-justify-start pw-gap-4 pw-w-full pw-flex-1">
            <div className="pw-flex pw-flex-col sm:pw-w-[47px] pw-justify-center pw-items-center">
              <div className="pw-text-[24px] pw-leading-[36px] pw-font-bold pw-text-[#295BA6] pw-text-center">
                {shortDay[getDay(eventDate)]}
              </div>
              <div className="pw-text-[14px] pw-leading-[21px] pw-font-normal pw-text-[#777E8F] pw-text-center pw-w-[50px]">
                {format(eventDate, 'dd MMM yyyy')}
              </div>
              <div className="pw-text-[15px] pw-leading-[23px] pw-font-semibold pw-text-[#353945] pw-text-center">
                {format(eventDate, "HH'h'mm")}
              </div>
            </div>
            <div className="pw-h-[152px] sm:pw-h-[101px] pw-bg-[#DCDCDC] pw-w-[1px]" />
            <div className="pw-flex pw-flex-col pw-justify-center pw-flex-1">
              <div className="pw-text-[18px] pw-leading-[23px] pw-font-bold pw-text-[#295BA6]">
                {token.name}
              </div>
              <div className="pw-text-[14px] pw-leading-[21px] pw-font-normal pw-text-[#777E8F]">
                {token.address.street}
                {', '}
                {token.address.city}
                {' - '}
                {token.address.country}
              </div>
              <div className="pw-text-[14px] pw-leading-[21px] pw-font-normal pw-text-[#777E8F]">
                {token.address.cabin}
              </div>
              <div className="pw-text-[15px] pw-leading-[22px] pw-font-normal pw-text-[#353945] pw-mt-3">
                <Trans
                  i18nKey={'token>pass>totalValidedTokens'}
                  tOptions={{ total: 100 }}
                >
                  Total tokens validados:{' '}
                  <span className="pw-font-semibold">100</span>
                </Trans>
              </div>
            </div>
          </div>
        </div>

        <div className="pw-w-full pw-flex pw-flex-1 pw-justify-end">
          <button className="pw-bg-[#295BA6] hover:pw-bg-[#4194CD] pw-text-white pw-py-[7.5px] pw-px-6 pw-rounded-full pw-shadow-[0px_2px_4px_rgba(0,0,0,0.26)] pw-border-b pw-border-white">
            Validar benefício
          </button>
        </div>
      </div>

      <div className="pw-flex pw-flex-col pw-gap-[16px]">
        <Filters
          setSearchTerm={setSearchTerm}
          setStatus={handleStatusFilter}
          status={statusFilter}
          totalItens={filteredData.length}
        />
        <TableBase columns={title} data={filteredData} />
      </div>
    </BaseTemplate>
  ) : (
    <></>
  );
};

const Filters = ({
  setSearchTerm,
  setStatus,
  status,
  totalItens,
}: {
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setStatus: (e: string) => void;
  status: string[];
  totalItens?: number;
}) => {
  const [translate] = useTranslation();
  const [showFilter, setShowFilter] = useToggle(false);
  return (
    <div className="pw-flex pw-flex-col pw-gap-4">
      <div className="pw-w-full pw-flex">
        <input
          type="text"
          placeholder="Busca por ID, Nome..."
          className="pw-border pw-border-[#295BA6] pw-rounded-[8px] pw-p-[10px] pw-text-[13px] pw-leading-[19.5px] pw-text-[#353945] pw-w-full pw-max-w-[270px] sm:pw-max-w-[431px]"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
        />
        <div
          className={classNames(
            'pw-flex pw-justify-center pw-items-center pw-w-10 pw-h-10 pw-rounded-full pw-border pw-border-[#295BA6] pw-ml-4 pw-cursor-pointer ',
            showFilter ? 'pw-bg-[#295BA6]' : 'pw-bg-[#EFEFEF]'
          )}
          onClick={() => setShowFilter()}
        >
          <FilterIcon
            className={classNames(
              showFilter ? 'pw-stroke-[#EFEFEF]' : 'pw-stroke-[#295BA6]'
            )}
          />
        </div>
      </div>
      {showFilter ? (
        <>
          <div className="pw-flex pw-flex-col pw-gap-2 pw-text-[#777E8F] pw-text-[14px] pw-leading-[21px] pw-font-semibold">
            <div>{translate('token>pass>status')}</div>
            <div className="pw-flex pw-gap-2">
              {Object.keys(Status).map((item) => {
                const isChecked = status.find(
                  (e) => e.toLowerCase() === item.toLowerCase()
                );
                return (
                  <div
                    key={item}
                    className={classNames(
                      'pw-flex pw-gap-2 pw-items-center pw-justify-center pw-cursor-pointer',
                      isChecked ? 'pw-text-[#777E8F]' : 'pw-text-[#DCDCDC]'
                    )}
                    onClick={() => setStatus(item.toLowerCase())}
                  >
                    {isChecked ? (
                      <div className="pw-relative pw-h-[12.75px] pw-w-[12.75px] pw-border-[1.4px] pw-border-[#295BA6] pw-rounded-sm">
                        <div className="pw-absolute pw-w-[5px] pw-h-[10px] pw-border-t-[1.4px] pw-border-l-[1.4px] pw-border-[#295BA6] pw-rotate-[220deg] -pw-top-[40%] pw-left-[50%] pw-bg-white pw-shadow-[0px_1px_1px_rgb(255, 255, 255,1)]" />
                      </div>
                    ) : (
                      <div className="pw-h-[12.75px] pw-w-[12.75px] pw-border pw-border-[#295BA6] pw-rounded-sm" />
                    )}
                    <div
                      className={classNames(
                        'pw-rounded-full pw-w-[6px] pw-h-[6px]',
                        item === 'Erro' ? `pw-bg-[#ED4971]` : 'pw-bg-[#009A6C]'
                      )}
                    />

                    {item}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pw-text-[#777E8F] pw-text-[14px] pw-leading-[21px] pw-font-normal">
            {translate('token>pass>total', { total: totalItens })}
          </div>
        </>
      ) : null}
    </div>
  );
};

const Status = {
  Validado: '#009A6C',
  Erro: '#ED4971',
};
