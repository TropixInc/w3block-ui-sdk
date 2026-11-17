import { format } from 'date-fns';

import { usePixwayAuthentication } from '../../auth/hooks/usePixwayAuthentication';
import { useThemeConfig } from '../../storefront/hooks/useThemeConfig';
import { PixwayAppRoutes } from '../enums/PixwayAppRoutes';
import { useProfile } from '../hooks/useProfile';
import { useProfileWithKYC } from '../hooks/useProfileWithKYC';
import { useRouterConnect } from '../hooks/useRouterConnect';
import useTranslation from '../hooks/useTranslation';
import { ImageSDK } from './ImageSDK';
import { getInitials, shortAddress } from './Menu';
import { DefinitionList } from './ui/DefinitionList';
import { PageHeader } from './ui/PageHeader';
import { UI } from './ui/tokens';

/**
 * Identity card of the profile page: avatar (or initials), name, e-mail,
 * member since, wallet address (unless the theme hides it) and the two
 * account actions, change password and sign out.
 */
export const MyProfile = () => {
  const { data: profile } = useProfile();
  const { profile: profileWithKYC } = useProfileWithKYC();
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const { signOut } = usePixwayAuthentication();
  const { defaultTheme } = useThemeConfig();
  const hideWallet =
    defaultTheme?.configurations?.contentData?.hideWalletAddress;

  const name = profile?.data?.name ?? '';
  const email = profile?.data?.email ?? '-';
  const createdAt = profile?.data?.createdAt
    ? format(new Date(profile.data.createdAt as string), 'dd/MM/yyyy')
    : null;
  const address = profile?.data?.mainWallet?.address;

  const handleSignOut = () => {
    signOut().then(() => router.pushConnect(PixwayAppRoutes.SIGN_IN));
  };

  return (
    <PageHeader
      title={
        <span className="pw-flex pw-items-center pw-gap-3">
          {profileWithKYC?.avatarSrc ? (
            <ImageSDK
              className="pw-rounded-full pw-w-11 pw-h-11 pw-object-cover pw-shrink-0"
              height={44}
              width={44}
              fit="fill"
              src={profileWithKYC.avatarSrc}
            />
          ) : (
            <span
              className="pw-grid pw-place-items-center pw-w-11 pw-h-11 pw-rounded-full pw-bg-brand-primary pw-text-white pw-text-[15px] pw-font-bold pw-shrink-0"
              aria-hidden
            >
              {getInitials(name)}
            </span>
          )}
          <span className="pw-min-w-0 pw-truncate">
            {name || translate('components>menu>myProfile')}
          </span>
        </span>
      }
      actions={
        <>
          <a
            href={router.routerToHref(PixwayAppRoutes.REQUEST_PASSWORD_CHANGE)}
            className={UI.buttonSecondary}
          >
            {translate('shared>myProfile>changePassword')}
          </a>
          <button
            type="button"
            onClick={handleSignOut}
            className={UI.buttonSecondary}
          >
            {translate('components>menu>logout')}
          </button>
        </>
      }
    >
      <DefinitionList
        items={[
          { term: translate('shared>myProfile>name'), value: name || '-' },
          { term: 'E-mail', value: email },
          ...(createdAt
            ? [
                {
                  term: translate('components>menu>memberSince'),
                  value: createdAt,
                },
              ]
            : []),
          ...(address && !hideWallet
            ? [
                {
                  term: translate('shared>myProfile>wallet'),
                  value: <span title={address}>{shortAddress(address)}</span>,
                },
              ]
            : []),
        ]}
      />
    </PageHeader>
  );
};
