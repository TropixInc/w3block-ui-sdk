import classNames from 'classnames';

import { ReactComponent as BoxWithUpRightArrow } from '../../../shared/assets/icons/boxWithUpRightArrowFilled.svg';
import { ChainId } from '../../../shared/enums/ChainId';
import useTranslation from '../../../shared/hooks/useTranslation';
import useModalController from '../../hooks/useDialogController';
import { Tooltip } from '../Tooltip';

interface TokenLinkProps {
  href: string;
  label: string;
  className?: string;
  renderTooltip?: boolean;
  chainId?: number;
}

export const TokenScanLink = ({
  href,
  label,
  className = '',
  renderTooltip = false,
  chainId,
}: TokenLinkProps) => {
  const [translate] = useTranslation();
  const {
    isOpen: isTooltipOpen,
    openModal: openTooltip,
    closeModal: closeTooltip,
  } = useModalController();

  const tooltipText = () => {
    if (chainId === ChainId.POLYGON || chainId === ChainId.MUMBAI) {
      return translate('tokens>tokenScanLink>viewIn', {
        blockchain: 'Polygonscan',
      });
    } else {
      return translate('tokens>tokenScanLink>viewIn', {
        blockchain: 'Etherscan',
      });
    }
  };

  return (
    <div className="pw-relative">
      <Tooltip
        visible={isTooltipOpen && renderTooltip}
        className="pw-absolute -pw-top-12"
        classes={{
          content:
            'pw-bg-white pw-py-3 after:pw-border-[#FFF_transparent_transparent_transparent] pw-shadow-[0_4px_15px_#00000012]',
        }}
        arrowPosition="bottom"
      >
        <p>{tooltipText()}</p>
      </Tooltip>
      <a
        target="_blank"
        onMouseEnter={openTooltip}
        onMouseLeave={closeTooltip}
        href={href}
        className={classNames(
          className,
          'pw-flex pw-items-center pw-relative pw-z-20 pw-w-max pw-gap-x-4 pw-mb-[11px] pw-font-medium pw-leading-[19px] pw-text-[#B09C60] hover:pw-underline'
        )}
        rel="noreferrer"
      >
        {label}
        <BoxWithUpRightArrow className="pw-w-4 pw-h-4 pw-fill-[#5682C3]" />
      </a>
    </div>
  );
};
