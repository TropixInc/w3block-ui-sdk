import { isGif, isVideo } from './validators';

interface Props {
  src: string;
  InternalProps: {
    width?: number;
    height?: number;
    quality?: 'best' | 'good' | 'eco' | 'low' | 'no-compression';
    fit?: 'fill' | 'fit';
  };
}

export const composeUrlCloudinary = ({
  src,
  InternalProps: { height, width, quality, fit = 'fill' },
}: Props) => {
  let url;
  const regexp = new RegExp('(.+/upload/)(.+)', 'g');
  const groups = regexp.exec(src);
  const isVid = isVideo(src);
  if (isVid) {
    if (groups) {
      url =
        groups[1] +
        `${width ? 'w_' + width : ''},${height ? 'h_' + height : ''},${
          width || height ? 'c_' + fit : ''
        }/${
          quality
            ? quality === 'no-compression'
              ? ''
              : 'q_auto:' + quality + ',f_auto/'
            : 'q_auto,f_auto/'
        }` +
        groups[2];
    } else {
      url = src;
    }
  } else if (isGif(src)) {
    if (groups) {
      url =
        groups[1] +
        `c_scale/${
          quality
            ? quality === 'no-compression'
              ? ''
              : 'q_auto:' + quality
            : 'q_auto'
        }/` +
        groups[2];
    } else {
      url = src;
    }
  } else {
    if (groups) {
      url =
        groups[1] +
        `${width ? 'w_' + width : ''}${height ? ',h_' + height : ''},${
          width || height ? 'c_' + fit : ''
        }/${
          quality
            ? quality === 'no-compression'
              ? ''
              : 'q_auto:' + quality + ',f_auto/'
            : 'q_auto,f_auto/'
        }` +
        groups[2];
    } else {
      url = src;
    }
  }

  return url;
};
