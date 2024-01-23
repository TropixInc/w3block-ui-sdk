import classNames from 'classnames';

import { Menu } from '../../../shared';
import { UtmAffiliates } from '../../components/UtmAffiliates';

export const UtmAffiliatesTemplateSDK = () => {
  return (
    <>
      <div className="pw-flex pw-flex-col pw-w-screen pw-font-poppins pw-container pw-mx-auto">
        <div
          className={classNames(
            'pw-flex pw-flex-col pw-w-full pw-flex-1 pw-py-[59px]'
          )}
        >
          <div className="pw-flex pw-w-full pw-gap-x-6 pw-my-[25px]">
            <div className="pw-w-[295px] pw-shrink-0 pw-hidden sm:pw-block">
              <Menu />
            </div>
            <div className="pw-w-full">
              <div className="pw-px-4 sm:pw-px-0 sm:pw-pl-8 pw-w-full">
                <div className="pw-mt-6 pw-w-full pw-flex pw-flex-col pw-gap-[34px] pw-items-start pw-bg-white pw-rounded-[20px] pw-shadow-[2px_2px_10px] pw-shadow-[#00000014] pw-p-[34px]">
                  <UtmAffiliates />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
