import { useDynamicString } from "../hooks/useDynamicString";
import { useMobilePreferenceDataWhenMobile } from "../hooks/useMergeMobileData";
import { ButtonData } from "../interfaces/Theme";

export const StorefrontButton = ({ data }: { data: ButtonData }) => {
  const { styleData, mobileStyleData } = data;

  const mergedStyleData = useMobilePreferenceDataWhenMobile(
    styleData,
    mobileStyleData
  );

  const {
    title: titleInput,
    href: hrefInput,
    width,
    height,
    bgColor,
  } = mergedStyleData;

  const { text: title } = useDynamicString(titleInput);
  const { text: href } = useDynamicString(hrefInput);

  return (
    <a
      href={href}
      style={{
        width: width ?? '60px',
        height: height ?? '60px',
        backgroundColor: bgColor ?? '#D9D9D9',
        color: 'black',
        fontSize: '9px',
        borderRadius: '8px',
        fontWeight: '600',
      }}
      className={`hover:pw-bg-[#83F9DC] pw-flex pw-justify-center pw-items-center `}
    >
      {title}
    </a>
  );
};
