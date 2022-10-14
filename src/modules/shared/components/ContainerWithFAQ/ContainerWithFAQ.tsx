import { ReactNode } from 'react';

import { FAQ } from '../FAQ';

interface ContainerWithFAQProps {
  children?: ReactNode;
  faqType?: string;
}

export const ContainerWithFAQ = ({
  children,
  faqType,
}: ContainerWithFAQProps) => {
  return (
    <div className="pw-flex pw-flex-col pw-h-full pw-px-4 lg:pw-px-0">
      <div className="pw-container pw-mx-auto pw-h-full lg:pw-flex pw-w-full pw-pt-[60px] pw-pb-[140px]">
        <div className="pw-w-[100%] lg:pw-w-[60%]">{children}</div>
        <div className="lg:pw-h-[370px] lg:pw-w-[2px] pw-w-full pw-h-[2px] pw-bg-[#DCDCDC] pw-mt-[24px] lg:pw-mt-0" />
        <div className="flex-1 pw-mt-6 sm:pw-mt-0">
          <FAQ
            classes={{
              title: 'pw-text-[#35394C] pw-ml-0 sm:pw-ml-7',
              subtitle: 'pw-text-[#35394C] pw-ml-0 sm:pw-ml-7',
            }}
            name={faqType}
          />
        </div>
      </div>
    </div>
  );
};
