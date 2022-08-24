export const removeDuplicateSlahes = (url: string) =>
  url.replace(/([^:]\/)\/+/g, '$1');
