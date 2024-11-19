export const getProductSlug = (url: string) => {
  try {
    if (url) {
      const newUrl =
        url?.indexOf('http') === 0
          ? url
          : url.indexOf('localhost') === 0
          ? `http://${url}`
          : `https://${url}`;

      const match =
        new URL(newUrl).pathname.match(/\/product\/slug\/([a-zA-Z0-9\\-]+)/) ||
        new URL(newUrl).pathname.match(/\/item\/([a-zA-Z0-9\\-]+)/);

      if (match) return match[1];
    }
  } catch (e) {
    console.log(e);
  }
  return;
};
