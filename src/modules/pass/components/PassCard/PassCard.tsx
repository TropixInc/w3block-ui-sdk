import { lazy } from 'react';

import classNames from 'classnames';
const Button = lazy(() =>
  import('../../../shared/components/Buttons').then((mod) => ({
    default: mod.Button,
  }))
);
const FallbackImage = lazy(() =>
  import('../../../shared/components/FallbackImage').then((mod) => ({
    default: mod.FallbackImage,
  }))
);
const ImageSDK = lazy(() =>
  import('../../../shared/components/ImageSDK').then((mod) => ({
    default: mod.ImageSDK,
  }))
);

import Skeleton from '../../../shared/components/Skeleton/Skeleton';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import useRouter from '../../../shared/hooks/useRouter';
import useTranslation from '../../../shared/hooks/useTranslation';

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

const cardClassName =
  'pw-p-[18px] pw-rounded-[20px] pw-border pw-border-[#E6E8EC] pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] hover:pw-border-[#295BA6] hover:pw-cursor-pointer';

const descriptionContainerClassName =
  'pw-w-full pw-flex pw-flex-col pw-gap-y-2.5 pw-mt-2.5';

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
  const router = useRouter();

  const query = `?chainId=${chainId}&contractAddress=${contractAddress}`;

  return (
    <div
      className={classNames(
        cardClassName,
        'pw-flex pw-flex-col pw-gap-[24px] pw-relative pw-overflow-hidden'
      )}
    >
      <div className="pw-flex pw-flex-col pw-justify-center pw-items-center pw-gap-[10px]">
        <div className="pw-relative pw-overflow-hidden pw-w-full">
          <div className="pw-bg-white pw-absolute pw-left-[13px] pw-top-[14px] pw-rounded-full">
            <div className="pw-bg-brand-primary/30 pw-text-brand-primary pw-text-[12px] pw-leading-[18px] pw-font-bold pw-border pw-border-brand-primary pw-rounded-full pw-py-1 pw-px-2">
              {translate('connectTokens>tokensList>tokenPass')}
            </div>
          </div>

          {image ? (
            <ImageSDK
              src={image}
              className="pw-w-full pw-h-[300px] pw-object-cover pw-rounded-[20px]"
              alt={name}
            />
          ) : (
            <FallbackImage className="pw-h-full pw-max-h-[300px] pw-w-full pw-min-h-[300px] pw-rounded-[20px]" />
          )}
        </div>

        <div className={descriptionContainerClassName}>
          <p className="pw-text-black pw-font-semibold pw-text-base pw-leading-[22px] pw-truncate">
            {tokenName}
          </p>
          <p className="pw-text-black pw-font-normal pw-text-sm pw-leading-[22px] pw-truncate">
            {name}
          </p>
        </div>
      </div>

      <div className="pw-relative pw-flex pw-justify-end pw-items-center">
        <Button
          disabled={proccessing}
          model="primary"
          width="small"
          onClick={() =>
            router.push(
              PixwayAppRoutes.TOKENPASS_DETAIL.replace(
                '{tokenPassId}',
                id
              ).concat(query)
            )
          }
        >
          {translate('token>pass>seeBenefits')}
        </Button>
      </div>
    </div>
  );
};

const CardSkeleton = () => {
  return (
    <div className={cardClassName}>
      <Skeleton className="pw-w-[260px] pw-h-[260px]" />
      <div className={descriptionContainerClassName}>
        <Skeleton className="pw-w-full pw-max-w-[150px] pw-h-[20px]" />
        <Skeleton className="pw-w-full pw-max-w-[200px] pw-h-[23px]" />
        <div className="pw-flex pw-justify-between pw-items-center">
          <Skeleton className="pw-w-full pw-max-w-[39px] pw-h-[22px] pw-rounded-full" />
          <Skeleton className="pw-w-full pw-max-w-[130px] pw-h-[22px] pw-rounded-full" />
        </div>
      </div>
    </div>
  );
};

PassCard.Skeleton = CardSkeleton;
