import { InternalPagesLayoutBase } from '../../../shared';
import { ReactComponent as UserIcon } from '../../../shared/assets/icons/userOutlined.svg';
import {
  TableDefault,
  TableHeaderItem,
} from '../../../shared/components/TableDefault/TableDefault';
import { useGuardPagesWithOptions } from '../../../shared/hooks/useGuardPagesWithOptions/useGuardPagesWithOptions';
import { ActionBusinessCardSDK } from '../../components/actionBusinessCardSDK';

export const UserReportTemplate = () => {
  useGuardPagesWithOptions({ needBusiness: true });
  const header: TableHeaderItem[] = [
    {
      key: 'status',
      name: 'Status',
      component: (item: any) => (
        <div className="pw-flex pw-items-center pw-gap-1">
          <div
            style={{ backgroundColor: 'green' }}
            className="pw-w-2 pw-h-2 pw-rounded-full"
          ></div>
          <p className="pw-text-slate-500 pw-text-sm pw-font-semibold">
            {item.status}
          </p>
        </div>
      ),
    },
    {
      key: 'client',
      name: 'Cliente',
    },
    {
      key: 'cpf',
      name: 'CPF',
    },
    {
      key: 'quantity',
      name: 'Qtde.',
    },
    {
      key: 'date',
      name: 'Data',
    },
  ];
  return (
    <InternalPagesLayoutBase>
      <div className=" pw-p-6 pw-bg-white pw-rounded-[20px] pw-shadow pw-flex-col pw-justify-start pw-items-start">
        <div className=" pw-text-black pw-text-[23px] pw-font-semibold pw-leading-loose">
          Fidelidade
        </div>
        <ActionBusinessCardSDK
          title="Pagamento"
          icon={<UserIcon />}
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam a turpis lacus. "
          buttonText="Pagar"
          onClick={() => console.log('teste')}
        />
        <div className="pw-flex pw-justify-between pw-items-center pw-mt-8">
          <p className="pw-text-zinc-800 pw-text-lg pw-font-medium pw-leading-[23px]">
            Relatório de uso
          </p>
          <button className="pw-text-zinc-700 pw-text-[15px] pw-font-semibold ">
            Ver relatório completo
          </button>
        </div>
        <TableDefault className="pw-mt-[20px]" data={[{}]} header={header} />
      </div>
    </InternalPagesLayoutBase>
  );
};
