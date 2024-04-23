import { useMemo, useRef, useState } from 'react';

import { composeUrlCloudinary } from '../../utils/composeUrlCloudinary';
import { isCloudinary, isVideo } from '../../utils/validators';

interface ImageSDKProps extends ImageSDKInternalProps {
  src?: string;
  className?: string;
  alt?: string;
  controls?: boolean;
}

interface ImageSDKInternalProps {
  width?: number;
  height?: number;
  quality?: 'best' | 'good' | 'eco' | 'no-compression';
  fit?: 'fill' | 'fit';
}

const imagePlaceholder =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png';

export const ImageSDK = ({
  src,
  className = '',
  width,
  height,
  quality = 'good',
  fit = 'fill',
  alt = '',
  controls = false,
}: ImageSDKProps) => {
  const preImageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isCloud = isCloudinary(src ?? '');
  const isVid = isVideo(src ?? '');
  const [isError, setError] = useState(false);
  const VideoThreath = () => {
    return (
      <>
        <img
          alt={alt}
          className={className}
          ref={preImageRef}
          src={composeUrlCloudinary({
            src: src?.replace('.mp4', '.png') ?? '',
            InternalProps: { width, height, quality, fit },
          })}
        ></img>
        <video
          className={className}
          ref={videoRef}
          autoPlay
          muted
          controlsList="nodownload noplaybackrate"
          disablePictureInPicture
          controls={controls}
          loop
          playsInline
          onLoadedData={() => {
            if (videoRef.current && preImageRef.current) {
              videoRef.current.style.display = 'block';
              preImageRef.current.style.display = 'none';
            }
          }}
          style={{ display: 'none' }}
          src={composeUrlCloudinary({
            src: src ?? '',
            InternalProps: { width, height, quality, fit },
          })}
        ></video>
      </>
    );
  };

  const ImageThreath = () => {
    return (
      <>
        <img
          alt={alt}
          className={className}
          ref={preImageRef}
          onError={() => setError(true)}
          src={
            isError
              ? imagePlaceholder
              : composeUrlCloudinary({
                  src: src ?? '',
                  InternalProps: { width, height, quality, fit },
                })
          }
        ></img>
        <img
          alt={alt}
          className={className}
          ref={imageRef}
          onLoad={() => {
            if (imageRef.current && preImageRef.current) {
              imageRef.current.style.display = 'block';
              preImageRef.current.style.display = 'none';
            }
          }}
          onError={() => setError(true)}
          style={{ display: 'none' }}
          src={
            isError
              ? imagePlaceholder
              : composeUrlCloudinary({
                  src: src ?? '',
                  InternalProps: { width, height, quality, fit },
                })
          }
        ></img>
      </>
    );
  };

  return useMemo(() => {
    if (!src) {
      return (
        <img alt={alt} className={`${className}`} src={imagePlaceholder}></img>
      );
    } else if (isCloud) {
      return isVid ? <VideoThreath /> : <ImageThreath />;
    } else {
      return isVid ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          controlsList="nodownload noplaybackrate"
          disablePictureInPicture
          controls={controls}
          playsInline
          className={`${className}`}
          src={src ?? ''}
        ></video>
      ) : (
        <img
          alt={alt}
          // onError={() => setError(true)}
          className={`${className}`}
          src={isError ? imagePlaceholder : src ?? ''}
        ></img>
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, isError, className, isVid, isCloud]);
};
