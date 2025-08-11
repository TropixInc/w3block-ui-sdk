import useTranslation from "../../shared/hooks/useTranslation";


export const InternalPageTitle = ({
  title,
  contract,
}: {
  title: string;
  contract: string;
}) => {
  const [translate] = useTranslation();
  return (
    <>
      {title || contract ? (
        <div className="pw-flex pw-flex-col pw-gap-y-2 sm:pw-gap-y-6">
          {title && (
            <div>
              <p className=" pw-font-normal pw-text-sm pw-text-[#777E8F]">
                {'Token Pass'}
              </p>
              <p className="pw-font-bold pw-text-2xl pw-leading-9 pw-text-black">
                {title}
              </p>
            </div>
          )}
          {contract && (
            <div className="pw-flex pw-items-center">
              <p className="pw-font-semibold pw-text-[15px] pw-leading-[22.5px] pw-text-black">
                {translate('connect>tokenDetailsCard>contract')}
              </p>
              <p className="pw-font-normal pw-ml-1 pw-text-[15px] pw-leading-[22.5px] pw-text-[#777E8F]">
                {contract}
              </p>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
};
