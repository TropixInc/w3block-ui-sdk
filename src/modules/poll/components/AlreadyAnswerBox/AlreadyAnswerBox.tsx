import { useRouterConnect } from '../../../shared';
import { ReactComponent as InfoIcon } from '../../../shared/assets/icons/informationCircledFilled.svg';
import { Box } from '../../../shared/components/Box/Box';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { usePixwaySession } from '../../../shared/hooks/usePixwaySession';
import useTranslation from '../../../shared/hooks/useTranslation';
export const AlreadyAnswerBox = () => {
  const router = useRouterConnect();
  const [translate] = useTranslation();
  const { data: session } = usePixwaySession();
  return (
    <Box>
      <div className="flex pw-flex-col pw-items-center">
        <InfoIcon className="pw-w-[48px] pw-h-[48px]" />
        <p className="pw-text-center pw-text-[24px] pw-font-roboto pw-font-[700] pw-text-[#272727] pw-mt-3">
          {translate('auth>poll>pollAnswered')}
        </p>
        <p className="pw-text-center pw-text-[20px] pw-font-roboto pw-font-[700] pw-text-[#272727] pw-mt-6">
          {translate('poll>alreadyAnswered>phrase')}
        </p>
        {session ? (
          <p className="pw-font-poppins pw-text-[#272727] pw-mt-4 pw-font-[500]">
            {translate('auth>poll>goTo')}{' '}
            <a
              className="pw-text-underline pw-text-[#295BA6] pw-cursor-pointer"
              href={router.routerToHref(PixwayAppRoutes.MY_TOKENS)}
            >
              {translate('connectTokens>tokensList>pageTitle')}
            </a>
          </p>
        ) : (
          <p className="pw-font-poppins pw-text-[#272727] pw-mt-4 pw-font-[500]">
            {translate('auth>poll>redirectLogin>alreadyAccount')}{' '}
            <a
              className="pw-text-underline pw-text-[#295BA6] pw-cursor-pointer"
              href={router.routerToHref(PixwayAppRoutes.SIGN_IN)}
            >
              {translate('tokens>unsignedUserAlert>signIn')}
            </a>
          </p>
        )}
      </div>
    </Box>
  );
};
