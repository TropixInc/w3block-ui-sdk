import { isVideo } from './validators';

interface Props {
  src: string;
  InternalProps: {
    width?: number;
    height?: number;
    quality?: 'best' | 'good' | 'eco' | 'low';
    fit?: 'fill' | 'fit';
  };
}

export const threathUrlCloudinary = ({
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
        `${width ? 'w_' + width : ''},${height ? 'h_' + height : ''},c_${fit}/${
          quality ? 'q_auto:' + quality : 'q_auto'
        },f_auto/` +
        groups[2];
    } else {
      url = src;
    }
  } else {
    if (groups) {
      url =
        groups[1] +
        `${width ? 'w_' + width : ''}${height ? ',h_' + height : ''},c_${fit}/${
          quality ? 'q_auto:' + quality : 'q_auto'
        },f_auto/` +
        groups[2];
    } else {
      url = src;
    }
  }

  return url;
};
