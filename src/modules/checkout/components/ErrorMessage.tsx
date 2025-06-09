interface ErrorMessageInterface {
  title?: string;
  message?: string;
  className?: string;
  titleClassName?: string;
  messageClassName?: string;
}

export const ErrorMessage = ({
  title,
  message,
  className = '',
  titleClassName = '',
  messageClassName = '',
}: ErrorMessageInterface) => {
  return (
    <div
      className={`pw-w-full pw-p-4 pw-bg-red-100 pw-rounded-xl ${className}`}
    >
      <p
        className={`pw-text-[#ED4971] pw-font-bold pw-text-xs ${titleClassName}`}
      >
        {title}
      </p>
      {message && (
        <p className={`pw-text-black pw-text-xs ${messageClassName}`}>
          {message}
        </p>
      )}
    </div>
  );
};
