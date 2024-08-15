interface Params {
  text?: string;
  bgColor?: string;
  target?: string;
  textColor?: string;
  link?: string;
}

export const Redirect = ({
  bgColor,
  text,
  target,
  textColor,
  link,
}: Params) => {
  return (
    <a
      style={{ backgroundColor: bgColor, color: textColor }}
      className="pw-w-full pw-mb-2 pw-p-[5px_48px_5px_48px] pw-rounded-[48px] pw-border-b pw-border-white hover:pw-shadow-[0px_2px_4px_0px_#00000042] pw-text-center pw-block"
      href={link}
      target={target}
    >
      {text}
    </a>
  );
};
