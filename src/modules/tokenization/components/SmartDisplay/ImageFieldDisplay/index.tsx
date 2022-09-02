import { useEffect, useMemo, useState } from 'react';

import classNames from 'classnames';
import ImageComponent from 'next/image';

import { convertBytesToMegaBytes } from '../../../utils/convertBytesToMegaBytes';

interface Props {
  className?: string;
  image: File | string;
  label: string;
}

const getImageSizeInMB = (size: number) =>
  `${Math.ceil(convertBytesToMegaBytes(size)).toFixed(0)}MB`;

const ImageFieldDisplay = ({ image, label, className = '' }: Props) => {
  const [imageSize, setImageSize] = useState(() =>
    typeof image === 'string' ? '' : getImageSizeInMB(image.size)
  );
  const { fileName, src } = useMemo(() => {
    if (typeof image === 'string') {
      return {
        fileName: '',
        src: image,
      };
    }
    return {
      fileName: image.name,
      src: URL.createObjectURL(image),
    };
  }, [image]);

  useEffect(() => {
    if (typeof image === 'string') {
      getImageSizeFromURL();
    } else {
      setImageSize(getImageSizeInMB(image.size));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  const getImageSizeFromURL = async () => {
    if (src) {
      return fetch(src)
        .then((response) => response.blob())
        .then((blob) => setImageSize(getImageSizeInMB(blob.size)));
    }
  };

  return (
    <div className={classNames('flex flex-col gap-y-4', className)}>
      <h2>{label}</h2>
      <div className="flex items-center gap-x-2">
        {src ? (
          <ImageComponent src={src} alt="" width={32} height={32} />
        ) : null}
        <div className="flex flex-col gap-y-0.5 text-xs leading-[14px] text-[#676767]">
          <p>{fileName}</p>
          <p>{imageSize}</p>
        </div>
      </div>
    </div>
  );
};

export default ImageFieldDisplay;
