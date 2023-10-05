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

export const isCloudinary = (url: string): boolean => {
  return url.includes('res.cloudinary') && !url.includes('/image/fetch/');
};

// Blacklist common values.
const BLACKLIST: Array<string> = [
  '00000000000',
  '11111111111',
  '22222222222',
  '33333333333',
  '44444444444',
  '55555555555',
  '66666666666',
  '77777777777',
  '88888888888',
  '99999999999',
  '12345678909',
];

const STRICT_STRIP_REGEX = /[.-]/g;
const LOOSE_STRIP_REGEX = /[^\d]/g;

const verifierDigit = (digits: string): number => {
  const numbers: Array<number> = digits.split('').map((number) => {
    return parseInt(number, 10);
  });

  const modulus: number = numbers.length + 1;
  const multiplied: Array<number> = numbers.map(
    (number, index) => number * (modulus - index)
  );
  const mod: number =
    multiplied.reduce((buffer, number) => buffer + number) % 11;

  return mod < 2 ? 0 : 11 - mod;
};

const strip = (number: string, strict?: boolean): string => {
  const regex: RegExp = strict ? STRICT_STRIP_REGEX : LOOSE_STRIP_REGEX;
  return (number || '').replace(regex, '');
};

export const isValidCPF = (number: string, strict?: boolean): boolean => {
  const stripped: string = strip(number, strict);

  // CPF must be defined
  if (!stripped) {
    return false;
  }

  // CPF must have 11 chars
  if (stripped.length !== 11) {
    return false;
  }

  // CPF can't be blacklisted
  if (BLACKLIST.includes(stripped)) {
    return false;
  }

  let numbers: string = stripped.substr(0, 9);
  numbers += verifierDigit(numbers);
  numbers += verifierDigit(numbers);

  return numbers.substr(-2) === stripped.substr(-2);
};

// Blacklist common values.
const BLACKLISTCNPJ: Array<string> = [
  '00000000000000',
  '11111111111111',
  '22222222222222',
  '33333333333333',
  '44444444444444',
  '55555555555555',
  '66666666666666',
  '77777777777777',
  '88888888888888',
  '99999999999999',
];

const STRICT_STRIP_REGEX_CNPJ = /[-\\/.]/g;
const LOOSE_STRIP_REGEX_CNPJ = /[^\d]/g;

const stripCNPJ = (number: string, strict?: boolean): string => {
  const regex: RegExp = strict
    ? STRICT_STRIP_REGEX_CNPJ
    : LOOSE_STRIP_REGEX_CNPJ;
  return (number || '').replace(regex, '');
};

export const isValidCNPJ = (number: string, strict?: boolean): boolean => {
  const stripped: string = stripCNPJ(number, strict);

  // CNPJ must be defined
  if (!stripped) {
    return false;
  }

  // CNPJ must have 14 chars
  if (stripped.length !== 14) {
    return false;
  }

  // CNPJ can't be blacklisted
  if (BLACKLISTCNPJ.includes(stripped)) {
    return false;
  }

  let numbers: string = stripped.substr(0, 12);
  numbers += verifierDigit(numbers);
  numbers += verifierDigit(numbers);

  return numbers.substr(-2) === stripped.substr(-2);
};

export const cleanObject = (obj: any): any => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === 'object') cleanObject(obj[key]);
    else if (obj[key] == null || obj[key] == '') delete obj[key];
    else if (typeof obj[key] === 'boolean') obj[key] = obj[key] ? 1 : 0;
  });
  return obj;
};

export function isValidUrl(string: string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}
