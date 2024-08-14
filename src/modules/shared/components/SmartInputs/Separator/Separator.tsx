interface Params {
  showLine?: boolean;
  text?: string;
  textAbove?: boolean;
  marginTop?: string;
  marginBottom?: string;
}

export const Separator = ({
  showLine,
  text,
  textAbove,
  marginTop,
  marginBottom,
}: Params) => {
  return (
    <div style={{ marginBottom: marginBottom, marginTop: marginTop }}>
      {textAbove && text ? (
        <p className="pw-flex pw-gap-x-2 pw-items-center pw-text-[18px] pw-w-auto pw-leading-[15px] pw-text-[#353945] pw-font-semibold pw-mb-5">
          {text}
        </p>
      ) : null}
      {showLine ? (
        <span className="pw-border-black pw-block pw-border pw-border-solid pw-w-full pw-mx-auto"></span>
      ) : null}
      {!textAbove && text ? (
        <p className="pw-flex pw-gap-x-2 pw-items-center pw-text-[18px] pw-w-auto pw-leading-[15px] pw-text-[#353945] pw-font-semibold pw-mt-5">
          {text}
        </p>
      ) : null}
    </div>
  );
};
