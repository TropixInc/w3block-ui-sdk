import UploadIcon from '../../../shared/assets/icons/uploadIcon.svg';
import { useUserWallet } from '../../shared/hooks/useUserWallet/useUserWallet';
import { useTranslation } from 'react-i18next';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { BalanceWalletArea } from './BalanceWalletArea';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { BaseButton } from '../../shared/components/Buttons';


export const AddFundsChoosePaymentContainer = () => {
  const { mainWallet: wallet } = useUserWallet();

  const [translate] = useTranslation();
  const router = useRouterConnect();
  return (
    <div className="">
      <p className="pw-font-montserrat pw-font-[700] pw-text-[18px]">
        {translate('wallet>page>addFunds')}
      </p>
      <p className="pw-font-montserrat pw-font-[700] pw-text-[24px] pw-mt-[16px]">
        {translate('addFunds>type>weblockWallet')}
      </p>
      <div className="pw-flex sm:pw-flex-row pw-flex-col pw-gap-x-4 pw-mt-4 pw-gap-y-4">
        <BalanceWalletArea paddingX={60}>
          <p className="pw-text-xs font-montserrat pw-font-[500] pw-text-[#383857]">
            {translate('addFunds>type>weblockWallet')}
          </p>
        </BalanceWalletArea>
        <BalanceWalletArea>
          <p className="pw-text-xs font-montserrat pw-text-[#383857] pw-font-[500]">
            {translate('addFunds>type>totalBalance')}:{' '}
            <span className="font-bold">{wallet?.balance ?? 0}</span>
          </p>
        </BalanceWalletArea>
      </div>
      <p className="pw-mt-4 pw-font-montserrat pw-font-[700] pw-text-[18px]">
        {translate('addFunds>type>choosePaymentType')}
      </p>
      <div className="pw-flex sm:pw-flex-row pw-flex-col pw-mt-4">
        <BaseButton
          onClick={() => router.pushConnect(PixwayAppRoutes.ADD_FUNDS_MANUAL)}
        >
          <div className="flex pw-justify-center items-center pw-gap-x-2">
            <UploadIcon />
            <p className="pw-text-white font-montserrat">
              {translate('addFunds>type>manualType')}
            </p>
          </div>
        </BaseButton>
      </div>
    </div>
  );
};
