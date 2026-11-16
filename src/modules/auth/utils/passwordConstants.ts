export const PASSWORD_MIN_LENGTH = 8;

export const PASSWORD_REGEX =
  /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

export const PASSWORD_HAS_NUMBER = /\d/g;
export const PASSWORD_HAS_CAPITALIZED_LETTER = /[A-Z]/g;
export const PASSWORD_HAS_UNCAPITALIZED_LETTER = /[a-z]/g;
