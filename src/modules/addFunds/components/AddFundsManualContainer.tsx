import { useState } from 'react';
import { useCopyToClipboard } from 'react-use';

import classNames from 'classnames';

import { Alert } from '../../shared/components/Alert';
import Skeleton from '../../shared/components/Skeleton';
import { SectionCard } from '../../shared/components/ui/SectionCard';
import { UI } from '../../shared/components/ui/tokens';
import useTranslation from '../../shared/hooks/useTranslation';
import { useUserWallet } from '../../shared/hooks/useUserWallet/useUserWallet';

/**
 * Manual top-up: the custodial wallet address to send funds to, with a copy
 * action and the "only ETH or MATIC" warning.
 */
export const AddFundsManualContainer = () => {
  const [copied, setCopied] = useState(false);
  const [translate] = useTranslation();
  const { mainWallet: wallet } = useUserWallet();
  const [, copyToClipboard] = useCopyToClipboard();

  const copyAddress = () => {
    copyToClipboard(wallet?.address || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="pw-flex pw-flex-col pw-gap-4">
      <SectionCard title={translate('addFunds>type>manual>walletAddress')}>
        <div className="pw-grid pw-gap-3">
          <p
            className={classNames(
              'pw-m-0 pw-text-[13.5px] pw-leading-relaxed',
              UI.textSecondary
            )}
          >
            {translate('addFunds>type>manual>instruction')}
          </p>
          <div
            className={classNames(
              'pw-flex pw-flex-col sm:pw-flex-row sm:pw-items-center pw-gap-3 pw-rounded-[10px] pw-border pw-px-3.5 pw-py-3',
              UI.line,
              UI.surfaceGrey
            )}
          >
            {wallet ? (
              <code
                className={classNames(
                  'pw-flex-1 pw-min-w-0 pw-break-all pw-text-[13px] pw-font-medium pw-tabular-nums',
                  UI.text
                )}
              >
                {wallet?.address || '—'}
              </code>
            ) : (
              <Skeleton className="pw-flex-1 pw-h-4 pw-rounded" />
            )}
            <button
              type="button"
              onClick={copyAddress}
              disabled={!wallet?.address}
              className={classNames(UI.buttonSecondary, 'pw-shrink-0')}
            >
              {copied
                ? translate('addFunds>type>manual>successCopy')
                : translate('tokens>passTemplate>copy')}
            </button>
          </div>
        </div>
      </SectionCard>

      <Alert variant="atention" className="pw-rounded-[10px]">
        <div className="pw-flex pw-gap-x-3 pw-w-full">
          <Alert.Icon />
          <div className="pw-flex-1 pw-grid pw-gap-0.5 pw-text-[13px]">
            <p className="pw-m-0 pw-font-semibold">
              {translate('addFunds>type>manual>onlyETHOrMatic')}
            </p>
            <p className="pw-m-0">
              {translate('addFunds>type>manual>loseFunds')}
            </p>
          </div>
        </div>
      </Alert>
    </div>
  );
};
