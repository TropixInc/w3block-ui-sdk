import { useMemo, useRef, useState } from 'react';

import { isCloudinary, isVideo } from '../../utils/validators';

interface ImageSDKProps extends ImageSDKInternalProps {
  src?: string;
  className?: string;
  alt?: string;
  controls?: boolean;
}

interface ImageSDKInternalProps {
  width?: string;
  height?: string;
  quality?: 'auto' | 'best' | 'good' | 'eco' | 'low';
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

  const threathUrlCloudinary = (
    s: string,
    { height: h, width: w, quality: q, fit: f }: ImageSDKInternalProps
  ) => {
    let url;
    const regexp = new RegExp('(.+/upload/)(.+)', 'g');
    const groups = regexp.exec(s ?? src);
    if (isVid) {
      if (groups) {
        url =
          groups[1] +
          `${w ? 'w_' + w : ''},${h ? 'h_' + h : ''},c_${f}/q_auto:${q}/` +
          groups[2];
      } else {
        url = src;
      }
    } else {
      if (groups) {
        url =
          groups[1] +
          `${w ? 'w_' + w : ''},${h ? 'h_' + h : ''},c_${f}/q_auto:${q}/` +
          groups[2];
      } else {
        url = src;
      }
    }

    return url;
  };

  const VideoThreath = () => {
    return (
      <>
        <img
          alt={alt}
          className={className}
          ref={preImageRef}
          src={src?.replace('.mp4', '.png')}
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
          src={threathUrlCloudinary(src ?? '', { width, height, quality, fit })}
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
              : threathUrlCloudinary(src ?? '', {
                  width,
                  height,
                  fit,
                  quality: 'low',
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
              : threathUrlCloudinary(src ?? '', {
                  width,
                  height,
                  quality: 'good',
                  fit,
                })
          }
        ></img>
      </>
    );
  };

  return useMemo(() => {
    if (isCloud && src?.includes('https://')) {
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
          onError={() => setError(true)}
          className={`${className}`}
          src={isError ? imagePlaceholder : src}
        ></img>
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, isError]);
};
