export const removeDuplicateSlahes = (url: string) =>
  url.replace(/([^:]\/)\/+/g, '$1');

export const removeDoubleSlashesOnUrl = (url: string) => {
  const https = url.includes('https:');
  const http = url.includes('http:');
  const query = new RegExp(/(\?.*)/, 'g').exec(url);
  const queryToSave = query?.length ? query[0] : '';
  let urlThreat = url
    .replace(/\?.*/, '')
    .replace(https ? 'https://' : 'http://', '')
    .replace('///', '/')
    .replace('//', '/');
  if (!https && !http) {
    return urlThreat + queryToSave;
  } else {
    urlThreat = (https ? 'https://' : 'http://') + urlThreat + queryToSave;
    return urlThreat;
  }
};
