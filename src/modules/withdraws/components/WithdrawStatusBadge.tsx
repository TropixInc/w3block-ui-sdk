import classNames from 'classnames';

import useTranslation from '../../shared/hooks/useTranslation';
import {
  Withdraw,
  WithdrawPillColor,
  WithdrawPresentation,
} from '../interfaces';
import {
  getWithdrawPaymentPresentation,
  getWithdrawStatusPresentation,
} from '../utils/presentation';

// Mesmas cores do StatusPill do Offpix, para as duas telas baterem.
export const WITHDRAW_PILL_CLASSES: Record<WithdrawPillColor, string> = {
  green: 'pw-bg-[#e7f7f0] pw-text-[#0e9f6e]',
  blue: 'pw-bg-[#eaf1fc] pw-text-[#3b7ddd]',
  amber: 'pw-bg-[#fdf5e6] pw-text-[#d9920a]',
  red: 'pw-bg-[#fdecec] pw-text-[#e23b3e]',
  gray: 'pw-bg-[#f1f3f6] pw-text-[#4a5567]',
};

interface PillProps {
  presentation: WithdrawPresentation;
  className?: string;
  /** Esconde o complemento ("· limite Pix"). */
  hideDetail?: boolean;
}

export const WithdrawPill = ({
  presentation,
  className,
  hideDetail,
}: PillProps) => (
  <span
    className={classNames(
      'pw-inline-flex pw-w-fit pw-items-center pw-gap-1.5 pw-rounded-full pw-px-2.5 pw-py-[3px] pw-text-[12px] pw-font-semibold pw-whitespace-nowrap',
      WITHDRAW_PILL_CLASSES[presentation.color],
      className
    )}
  >
    <span className="pw-h-[7px] pw-w-[7px] pw-rounded-full pw-bg-current" />
    {presentation.label}
    {presentation.detail && !hideDetail ? (
      <span className="pw-font-medium pw-opacity-80">{` · ${presentation.detail}`}</span>
    ) : null}
  </span>
);

interface Props {
  withdraw: Withdraw;
  className?: string;
  hideDetail?: boolean;
}

/** Pílula de status do saque (um único mapa rótulo/cor, em utils/presentation). */
export const WithdrawStatusBadge = ({
  withdraw,
  className,
  hideDetail,
}: Props) => {
  const [translate] = useTranslation();
  return (
    <WithdrawPill
      presentation={getWithdrawStatusPresentation(withdraw, translate)}
      className={className}
      hideDetail={hideDetail}
    />
  );
};

/** Pílula da coluna "Pagamento" (Pix automático, comprovante manual, rejeitado…). */
export const WithdrawPaymentBadge = ({
  withdraw,
  className,
  hideDetail,
}: Props) => {
  const [translate] = useTranslation();
  const presentation = getWithdrawPaymentPresentation(withdraw, translate);
  if (!presentation) return <span className="pw-text-[#8b93a3]">{'—'}</span>;
  return (
    <WithdrawPill
      presentation={presentation}
      className={className}
      hideDetail={hideDetail}
    />
  );
};
