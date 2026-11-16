import useTranslation from '../../../shared/hooks/useTranslation';

interface ProductDescriptionProps {
  htmlContent?: string;
  description?: string;
  descriptionTextColor?: string;
  className?: string;
}

export const ProductDescription = ({
  htmlContent,
  description,
  descriptionTextColor,
  className = '',
}: ProductDescriptionProps) => {
  const [translate] = useTranslation();
  const textColor = descriptionTextColor ?? 'black';

  return (
    <div
      className={`pw-rounded-[14px] pw-bg-white pw-p-[25px] pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] ${className}`}
    >
      <p style={{ color: textColor }} className="pw-text-[15px] pw-font-[600]">
        {translate('commerce>productPage>description')}
      </p>
      {htmlContent && htmlContent !== '' ? (
        <div
          style={{ color: textColor }}
          className="pw-text-[13px] pw-pb-8 pw-mt-6"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      ) : (
        <p style={{ color: textColor }} className="pw-text-[13px] pw-pb-8 pw-mt-6">
          {description}
        </p>
      )}
    </div>
  );
};
