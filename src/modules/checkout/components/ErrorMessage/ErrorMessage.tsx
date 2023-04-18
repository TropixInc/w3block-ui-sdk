interface ErrorMessageInterface {
  title?: string;
  message?: string;
  className?: string;
}

export const ErrorMessage = ({
  title,
  message,
  className = '',
}: ErrorMessageInterface) => {
  return (
    <div
      className={`pw-w-full pw-p-4 pw-bg-red-100 pw-rounded-xl ${className}`}
    >
      <p className="pw-text-[#ED4971] pw-font-bold pw-text-xs">{title}</p>
      {message && <p className="pw-text-black pw-text-xs">{message}</p>}
    </div>
  );
};
