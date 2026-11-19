import classNames from 'classnames';

import { FallbackImage } from '../../shared/components/FallbackImage';
import { ImageSDK } from '../../shared/components/ImageSDK';
import Skeleton from '../../shared/components/Skeleton';
import { StatusPill } from '../../shared/components/ui/StatusPill';
import { UI } from '../../shared/components/ui/tokens';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import useTranslation from '../../shared/hooks/useTranslation';

interface Props {
  id: string;
  name: string;
  image: string;
  className?: string;
  proccessing?: boolean;
  contractAddress?: string;
  chainId?: string;
  tokenName: string;
}

const cardClassName = classNames(
  UI.card,
  'pw-border pw-border-[#EEF0F3] pw-overflow-hidden hover:pw-border-brand-primary pw-transition-colors'
);

export const PassCard = ({
  image,
  name,
  id,
  proccessing = false,
  chainId,
  contractAddress,
  tokenName,
}: Props) => {
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const query = `?chainId=${chainId}&contractAddress=${contractAddress}`;
  const href = router.routerToHref(
    PixwayAppRoutes.TOKENPASS_DETAIL.replace('{tokenPassId}', id).concat(query)
  );

  return (
    <div
      className={classNames(cardClassName, 'pw-flex pw-flex-col pw-min-w-0')}
    >
      <div className="pw-relative">
        <span className="pw-absolute pw-left-3 pw-top-3 pw-z-[1]">
          <StatusPill tone="info" dot={false} size="sm">
            {translate('connectTokens>tokensList>tokenPass')}
          </StatusPill>
        </span>
        {image ? (
          <ImageSDK
            src={image}
            className="pw-w-full pw-h-[160px] pw-object-cover"
            alt={name}
          />
        ) : (
          <FallbackImage className="pw-w-full pw-h-[160px]" />
        )}
      </div>
      <div className="pw-flex pw-flex-col pw-gap-1 pw-p-4 pw-min-w-0">
        <p
          className={classNames(
            'pw-text-[14px] pw-font-semibold pw-truncate pw-m-0',
            UI.text
          )}
        >
          {tokenName}
        </p>
        {name && name.trim() !== (tokenName ?? '').trim() ? (
          <p
            className={classNames(
              'pw-text-[12.5px] pw-truncate pw-m-0',
              UI.textMuted
            )}
          >
            {name}
          </p>
        ) : null}
        <a
          href={proccessing ? undefined : href}
          aria-disabled={proccessing}
          className={classNames(
            UI.buttonSecondary,
            'pw-mt-3 pw-self-start',
            proccessing && 'pw-opacity-50 pw-pointer-events-none'
          )}
        >
          {translate('token>pass>seeBenefits')}
        </a>
      </div>
    </div>
  );
};

const CardSkeleton = () => {
  return (
    <div className={cardClassName}>
      <Skeleton className="pw-w-full pw-h-[160px]" />
      <div className="pw-flex pw-flex-col pw-gap-2 pw-p-4">
        <Skeleton className="pw-w-2/3 pw-h-4 pw-rounded" />
        <Skeleton className="pw-w-1/2 pw-h-3 pw-rounded" />
        <Skeleton className="pw-w-28 pw-h-9 pw-rounded-lg pw-mt-2" />
      </div>
    </div>
  );
};

PassCard.Skeleton = CardSkeleton;
