export const removeDuplicateSlahes = (url: string) =>
  url.replace(/([^:]\/)\/+/g, '$1');

export const removeDoubleSlashesOnUrl = (url: string) => {
  const https = url.includes('https:');
  const http = url.includes('http:');
  let urlThreat = url
    .replaceAll(https ? 'https://' : 'http://', https ? '${https}' : '${http}')
    .replace('///', '/')
    .replace('//', '/');
  if (!https && !http) {
    return urlThreat;
  } else {
    urlThreat = urlThreat.replaceAll(
      https ? '${https}' : '${http}',
      https ? 'https://' : 'http://'
    );
    return urlThreat;
  }
};
