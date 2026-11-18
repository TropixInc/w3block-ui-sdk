import classNames from 'classnames';

import useTranslation from '../../../shared/hooks/useTranslation';
import { useLocale } from '../../../shared/hooks/useLocale';
import {
  SETTLEMENT_PILL_CLASSES,
  SettlementColor,
  SettlementPresentation,
} from './settlement';

interface PillProps {
  color: SettlementColor;
  children: React.ReactNode;
  className?: string;
  /** Marca "*" de dado simulado (ver STATEMENT_MOCK_FALLBACK). */
  isMock?: boolean;
}

export const StatementPill = ({
  color,
  children,
  className,
  isMock,
}: PillProps) => {
  const [translate] = useTranslation();
  return (
    <span
      className={classNames(
        'pw-inline-flex pw-w-fit pw-items-center pw-gap-1.5 pw-rounded-full pw-px-2.5 pw-py-[3px] pw-text-[12px] pw-font-semibold pw-whitespace-nowrap',
        SETTLEMENT_PILL_CLASSES[color],
        className
      )}
    >
      <span className="pw-h-[7px] pw-w-[7px] pw-rounded-full pw-bg-current" />
      {children}
      {isMock ? (
        <span
          className="pw-text-[#9a6508] pw-font-bold"
          title={translate('statement>settlement>mockHint')}
        >
          *
        </span>
      ) : null}
    </span>
  );
};

interface Props {
  presentation: SettlementPresentation | null;
  className?: string;
  /** Rota do saque para o link "ver"; sem rota o texto fica sem link. */
  withdrawHref?: (withdrawId: string) => string;
}

/** Pill da coluna "Repasse" (aguardando liberação, aguardando repasse, em repasse, repassado…). */
export const SettlementPill = ({
  presentation,
  className,
  withdrawHref,
}: Props) => {
  const [translate] = useTranslation();
  const locale = useLocale();
  if (!presentation) return <span className="pw-text-[#8b93a3]">{'—'}</span>;

  const label = () => {
    switch (presentation.key) {
      case 'locked':
        return translate('statement>settlement>locked');
      case 'pending':
        return translate('statement>settlement>pending');
      case 'in_withdraw':
        return translate('statement>settlement>inWithdraw');
      case 'refused':
        return translate('statement>settlement>refused');
      case 'paid': {
        const date = presentation.paidAt ? new Date(presentation.paidAt) : null;
        const formatted =
          date && !Number.isNaN(date.getTime())
            ? date.toLocaleDateString(locale, {
                day: '2-digit',
                month: '2-digit',
              })
            : '';
        return formatted
          ? `${translate('statement>settlement>paid')} ${formatted}`
          : translate('statement>settlement>paid');
      }
      default:
        return '';
    }
  };

  const link =
    presentation.withdrawId && withdrawHref && !presentation.isMock
      ? withdrawHref(presentation.withdrawId)
      : null;

  return (
    <StatementPill
      color={presentation.color}
      className={className}
      isMock={presentation.isMock}
    >
      {label()}
      {link ? (
        <>
          {' · '}
          <a
            href={link}
            className="pw-font-semibold pw-underline pw-text-current"
          >
            {translate('statement>settlement>view')}
          </a>
        </>
      ) : null}
    </StatementPill>
  );
};
