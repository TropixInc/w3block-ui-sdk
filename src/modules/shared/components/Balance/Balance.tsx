import { ChainId } from '@w3block/sdk-id';
import classNames from 'classnames';

import { ReactComponent as ETHIcon } from '../../assets/icons/Eth.svg';
import { ReactComponent as MaticIcon } from '../../assets/icons/maticFilled.svg';
import { useUserWallet } from '../../hooks/useUserWallet';

interface Classes {
  container?: string;
  balance?: string;
}

interface Props {
  showValue?: boolean;
  classes?: Classes;
}

export const Balance = ({ showValue = true, classes }: Props) => {
  const { mainWallet: wallet } = useUserWallet();

  const renderIcon = () => {
    return wallet?.chainId === ChainId.Polygon ||
      wallet?.chainId === ChainId.Mumbai ? (
      <MaticIcon className="pw-fill-[#8247E5]" />
    ) : (
      <ETHIcon className="pw-fill-black" />
    );
  };

  return (
    <div className={classNames('pw-flex pw-items-center', classes?.container)}>
      {showValue ? (
        <>
          {renderIcon()}
          <p
            className={classNames(
              'pw-font-montserrat pw-font-[700] pw-text-xs pw-ml-1',
              classes?.balance
            )}
          >
            {parseFloat(wallet?.balance ?? '').toFixed(2)}
          </p>
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
