import classNames from 'classnames';

import { useLocale } from '../../shared/hooks/useLocale';
import useTranslation from '../../shared/hooks/useTranslation';
import {
  Withdraw,
  WithdrawTimelineEvent,
  WithdrawTimelineState,
} from '../interfaces';
import { formatWithdrawDateTime } from '../utils/format';
import { buildWithdrawTimeline } from '../utils/presentation';

const GLYPH: Record<
  WithdrawTimelineState,
  { glyph: string; className: string }
> = {
  done: { glyph: '✓', className: 'pw-bg-[#e7f7f0] pw-text-[#0e9f6e]' },
  failed: { glyph: '✗', className: 'pw-bg-[#fdecec] pw-text-[#e23b3e]' },
  blocked: { glyph: '!', className: 'pw-bg-[#fdf5e6] pw-text-[#d9920a]' },
  pending: { glyph: '◷', className: 'pw-bg-[#f1f3f6] pw-text-[#8b93a3]' },
};

interface Props {
  withdraw?: Withdraw;
  /** Eventos prontos (quando o chamador monta a linha do tempo por conta própria). */
  events?: WithdrawTimelineEvent[];
  className?: string;
}

/** Linha do tempo do saque: criado → escrow → trava do Pix → pagamento → evento Commerce. */
export const WithdrawTimeline = ({ withdraw, events, className }: Props) => {
  const [translate] = useTranslation();
  const locale = useLocale();
  const list =
    events ?? (withdraw ? buildWithdrawTimeline(withdraw, translate) : []);

  return (
    <ol
      className={classNames(
        'pw-flex pw-flex-col pw-gap-0 pw-m-0 pw-p-0 pw-list-none',
        className
      )}
    >
      {list.map((event, index) => {
        const glyph = GLYPH[event.state];
        const isLast = index === list.length - 1;
        return (
          <li key={event.key} className="pw-flex pw-gap-3 pw-relative">
            <div className="pw-flex pw-flex-col pw-items-center">
              <span
                className={classNames(
                  'pw-flex pw-h-6 pw-w-6 pw-shrink-0 pw-items-center pw-justify-center pw-rounded-full pw-text-[12px] pw-font-bold',
                  glyph.className
                )}
              >
                {glyph.glyph}
              </span>
              {!isLast ? (
                <span className="pw-w-px pw-flex-1 pw-bg-[#e6e8ec] pw-my-1" />
              ) : null}
            </div>
            <div
              className={classNames(
                'pw-flex pw-flex-col pw-gap-0.5 pw-min-w-0',
                !isLast && 'pw-pb-4'
              )}
            >
              <span
                className={classNames(
                  'pw-text-[13px] pw-font-semibold',
                  event.state === 'pending'
                    ? 'pw-text-[#8b93a3]'
                    : 'pw-text-[#0f1729]'
                )}
              >
                {event.title}
              </span>
              <span className="pw-text-[12px] pw-text-[#4a5567] pw-break-words">
                {event.at
                  ? formatWithdrawDateTime(event.at, locale)
                  : translate('withdraws>timeline>pending')}
                {event.detail ? ` · ${event.detail}` : ''}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
};
