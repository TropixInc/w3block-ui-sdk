/* eslint-disable i18next/no-literal-string */

import { useProfile } from '../hooks/useProfile';
import useTranslation from '../hooks/useTranslation';

import { InternalpageHeaderWithFunds } from "./InternalPageHeaderWithFunds"

export const MyProfile = () => {
  const { data: profile } = useProfile();
  const [translate] = useTranslation();

  return (
    <div className="">
      <InternalpageHeaderWithFunds
        title={translate('components>menu>myProfile')}
      >
        <div className="pw-w-full pw-flex pw-flex-col pw-gap-[34px]">
          <div>
            <p>E-mail</p>
            <div className=" pw-w-full pw-bg-white pw-text-black">
              {profile?.data.email ?? '-'}
            </div>
          </div>
        </div>
      </InternalpageHeaderWithFunds>
    </div>
  );
};
