import classNames from 'classnames';

import { chainIdToCode, useGetRightWallet } from '../../utils/getRightWallet';
import { CriptoValueComponent } from '../CriptoValueComponent/CriptoValueComponent';

interface Classes {
  container?: string;
  balance?: string;
}

interface Props {
  showValue?: boolean;
  classes?: Classes;
}

export const Balance = ({ showValue = true, classes }: Props) => {
  const organizedWallets = useGetRightWallet();

  return (
    <div className={classNames('pw-flex pw-items-center', classes?.container)}>
      {showValue ? (
        <>
          <CriptoValueComponent
            fontClass="pw-text-sm"
            crypto={true}
            value={organizedWallets[0].balance}
            code={chainIdToCode(
              organizedWallets[0].chainId,
              organizedWallets[0].currency
            )}
          />
        </>
      ) : (
        <p
          className={classNames(
            'pw-font-montserrat pw-font-[700] pw-text-xs',
            classes?.balance
          )}
        >
          ****
        </p>
      )}
    </div>
  );
};
