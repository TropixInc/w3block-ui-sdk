import { InternalPagesLayoutBase } from '../../../shared';
import { ReactComponent as UserIcon } from '../../../shared/assets/icons/userOutlined.svg';
import { ActionBusinessCardSDK } from '../../components/actionBusinessCardSDK';

export const UserReportTemplate = () => {
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
      </div>
    </InternalPagesLayoutBase>
  );
};
