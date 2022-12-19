export const isImage = (url: string): boolean => {
  return /(https|http:\/\/)([^\s(["<,>/]*)(\/)[^\s[",><]*(.png|.jpg|.svg|.eps|.pdf|.jpeg|.tiff|.bmp|.webp)(\?[^\s[",><]*)?/g.test(
    url
  );
};

export const isVideo = (url: string): boolean => {
  return /(https|http:\/\/)([^\s(["<,>/]*)(\/)[^\s[",><]*(.mp4|.m4v|.mov|.mpg|.mpeg|.avi|.asf)(\?[^\s[",><]*)?/g.test(
    url
  );
};

export const isGif = (url: string): boolean => {
  return /(https|http:\/\/)([^\s(["<,>/]*)(\/)[^\s[",><]*(.gif)(\?[^\s[",><]*)?/g.test(
    url
  );
};
