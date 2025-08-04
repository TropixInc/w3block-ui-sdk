import { useCompanyConfig } from "../hooks/useCompanyConfig";


export interface ContainerTextBesideProps {
  logo?: string;
  mainText?: string;
  subtitleText?: string;
  auxiliarText?: string;
  textColor?: string;
}

export const ContainerTextBeside = ({
  logo,
  mainText,
  subtitleText,
  auxiliarText,
  textColor = 'black',
}: ContainerTextBesideProps) => {
  const { logoUrl } = useCompanyConfig();
  const logoToUse = logo ?? logoUrl;
  return (
    <div className="pw-w-full pw-flex pw-flex-col pw-items-center sm:pw-items-start sm:pw-max-w-[600px] pw-px-8 sm:pw-px-0">
      <a href="/">
        <img
          className="sm:pw-max-w-[300px] pw-w-full pw-h-full pw-max-w-[230px] pw-max-h-[60px] sm:pw-max-h-[120px] pw-object-contain"
          src={logoToUse}
          alt=""
        />
      </a>
      <p
        style={{ color: textColor }}
        className="pw-text-[18px] pw-text-center sm:pw-text-left sm:pw-text-[55px] pw-font-poppins pw-font-[700] pw-leading-[23px] sm:pw-leading-[60px] pw-mt-[10px] sm:pw-mt-[20px]"
      >
        {mainText}
      </p>
      <p
        style={{ color: textColor }}
        className="sm:pw-text-[24px] pw-text-[14px] pw-text-center sm:pw-text-left pw-font-poppins pw-font-[500] pw-leading-[21px] sm:pw-leading-[27px] pw-mt-[10px] sm:pw-mt-[20px]"
      >
        {subtitleText}
      </p>
      <p
        style={{ color: textColor }}
        className="sm:pw-text-[14px] pw-text-[11px] pw-text-center sm:pw-text-left pw-font-poppins pw-font-[400] sm:pw-leading-[21px] pw-mt-[10px] sm:pw-mt-[20px]"
      >
        {auxiliarText}
      </p>
    </div>
  );
};
