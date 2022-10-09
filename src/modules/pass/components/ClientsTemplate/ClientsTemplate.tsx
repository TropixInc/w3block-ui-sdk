import { ChangeEvent, ReactNode, useState } from 'react';
import { useDebounce } from 'react-use';

import classNames from 'classnames';
import { format, getDay } from 'date-fns';

import { ReactComponent as FilterIcon } from '../../../shared/assets/icons/filterOutlined.svg';
import useTranslation from '../../../shared/hooks/useTranslation';
import { BaseTemplate } from '../BaseTemplate';
import { dataMoked } from './dataMoked';

export const ClientTemplate = () => {
  const [translate] = useTranslation();
  const [filteredData, setFilteredData] = useState(dataMoked);
  const [searchTerm, setSearchTerm] = useState('');

  const Lorem = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;
  const shortDay = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
  const token = {
    name: 'RIO World Skate Street World Championships',
    type: 'unique',
    id: '00000000000000000',
    detail: {
      name: '0Lorem Ipsum is simply dummy text of the printing.',
    },
    address: {
      name: 'Nome do endereço',
      street: 'Praça da Tijuca Rio de Janeiro',
      city: 'RJ',
      country: 'Brazil',
      rules: Lorem,
    },
  };
  const event = {
    date: '10/20/2022 14:30',
  };

  const eventDate = new Date(event.date);

  useDebounce(
    () => {
      const filter = searchTerm.toLowerCase();
      const filteredData = dataMoked.filter(
        (item) =>
          item.name.toLowerCase().includes(filter) ||
          item.id.toLowerCase().includes(filter) ||
          item.date.toLowerCase().includes(filter) ||
          item.status.toLowerCase().includes(filter) ||
          item.tokenId.toLowerCase().includes(filter) ||
          item.document.toLowerCase().includes(filter)
      );
      setFilteredData(filteredData);
    },
    500,
    [searchTerm]
  );

  const title = [
    'Nome',
    'Documento',
    'Token ID',
    'Carteira',
    'Data',
    'Local',
    'Status',
  ];

  return (
    <BaseTemplate>
      <div className="pw-flex pw-p-[16px] pw-gap-[16px] pw-items-center pw-border pw-border-[#E6E8EC] pw-rounded-[16px]">
        <div className="pw-w-[216px] pw-h-[175px] pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] pw-rounded-[20px]"></div>

        <div className="pw-flex pw-flex-col pw-w-[120px] pw-justify-center pw-items-center">
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
        <div className="pw-h-[119px] sm:pw-h-[101px] pw-bg-[#DCDCDC] pw-w-[1px]" />
        <div className="pw-flex pw-flex-col pw-justify-center">
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
          <div className="pw-flex pw-gap-1">
            <span className="pw-text-[14px] pw-leading-[21px] pw-font-semibold pw-text-[#353945]">
              {translate('token>pass>use')}
            </span>
            <div className="pw-text-[13px] pw-leading-[19.5px] pw-font-normal pw-text-[#777E8F]">
              {token.type === 'unique'
                ? translate('token>pass>unique')
                : translate('token>pass>youStillHave', { quantity: 5 })}
            </div>
          </div>
        </div>
      </div>

      <div className="pw-flex pw-flex-col pw-gap-[16px]">
        <div className="pw-w-full pw-flex">
          <input
            type="text"
            placeholder="Busca por ID, Nome..."
            className="pw-border pw-border-[#295BA6] pw-rounded-[8px] pw-p-[10px] pw-text-[13px] pw-leading-[19.5px] pw-text-[#353945] pw-w-full pw-max-w-[431px]"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
          />
          <div className="pw-flex pw-justify-center pw-items-center pw-w-10 pw-h-10 pw-rounded-full pw-bg-[#EFEFEF] pw-border pw-border-[#295BA6] pw-ml-4">
            <FilterIcon className="pw-stroke-[#295BA6]" />
          </div>
        </div>
        <table>
          <thead>
            <tr className="pw-flex pw-justify-between pw-bg-[#295BA6] pw-border pw-rounded-t-[16px]">
              {title.map((item, index) => (
                <th
                  key={item}
                  className={classNames(
                    index === 0 ? 'pw-w-[150px]' : 'pw-w-[128px]',
                    'pw-py-[13.5px] pw-pl-[20px] pw-text-left pw-text-[14px] pw-text-[#FFFFFF] pw-font-semibold pw-leading-[21px]'
                  )}
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length ? (
              filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="pw-flex pw-justify-between pw-border-b pw-border-[#EFEFEF]"
                >
                  <td className=" pw-pl-[20px] pw-w-[150px] pw-flex pw-justify-start pw-items-center pw-py-[21.5px] pw-text-[14px] pw-leading-[21px] pw-text-[#777E8F]">
                    {item.name}
                  </td>
                  <td className="pw-w-[128px] pw-flex pw-justify-center pw-items-center pw-py-[21.5px] pw-text-[14px] pw-leading-[21px] pw-text-[#777E8F]">
                    {item.document}
                  </td>
                  <td className="pw-w-[128px] pw-flex pw-justify-center pw-items-center pw-py-[21.5px] pw-text-[14px] pw-leading-[21px] pw-text-[#777E8F]">
                    {item.tokenId.slice(0, 9)}
                  </td>
                  <td className="pw-w-[128px] pw-flex pw-justify-center pw-items-center pw-py-[21.5px] pw-text-[14px] pw-leading-[21px] pw-text-[#777E8F]">
                    {item.wallet.slice(0, 9)}
                    {'...'}
                  </td>
                  <td className="pw-w-[128px] pw-flex pw-justify-center pw-items-center pw-py-[21.5px] pw-text-[14px] pw-leading-[21px] pw-text-[#777E8F]">
                    {format(new Date(item.date), 'dd.MM.yyyy')}
                  </td>
                  <td className="pw-w-[128px] pw-flex pw-justify-center pw-items-center pw-py-[21.5px] pw-text-[14px] pw-leading-[21px] pw-text-[#777E8F]">
                    {item.locale}
                  </td>
                  <td className="pw-w-[128px] pw-flex pw-justify-start pw-items-center pw-py-[21.5px] pw-text-[14px] pw-leading-[21px] pw-text-[#777E8F]">
                    <div
                      className={classNames(
                        'pw-rounded-full pw-w-[6px] pw-h-[6px] pw-mr-2',
                        item.status === 'Erro'
                          ? 'pw-bg-[#ED4971]'
                          : 'pw-bg-[#009A6C]'
                      )}
                    />
                    {item.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="pw-flex pw-justify-between pw-border-b pw-border-[#EFEFEF]">
                <td className="pw-pl-[50px] pw-py-[21.5px] pw-text-[14px] pw-leading-[21px] pw-text-[#777E8F]">
                  Nenhum resultado encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="pw-w-full pw-flex pw-justify-end pw-gap-2">
          <PaginationButton>{'<'}</PaginationButton>
          <PaginationButton>1</PaginationButton>
          <PaginationButton>2</PaginationButton>
          <PaginationButton>3</PaginationButton>
          <PaginationButton>...</PaginationButton>
          <PaginationButton>6</PaginationButton>
        </div>
      </div>
    </BaseTemplate>
  );
};

const PaginationButton = ({ children }: { children: ReactNode }) => (
  <div className="pw-w-10 pw-h-10 pw-bg-[#EFEFEF] pw-rounded-sm pw-flex pw-justify-center pw-items-center pw-font-semibold pw-text-[15px] pw-leading-[22px] pw-text-[#295BA6]">
    {children}
  </div>
);
