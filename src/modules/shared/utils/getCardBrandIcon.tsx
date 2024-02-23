import Amex from '../assets/cardsIcons/amex.svg?react';
import Diners from '../assets/cardsIcons/diners.svg?react';
import Discover from '../assets/cardsIcons/discover.svg?react';
import Hipercard from '../assets/cardsIcons/hipercard.svg?react';
import JCB from '../assets/cardsIcons/jcb.svg?react';
import Mastercard from '../assets/cardsIcons/mastercard.svg?react';
import Unionpay from '../assets/cardsIcons/unionpay.svg?react';
import Unknown from '../assets/cardsIcons/unknown.svg?react';
import Visa from '../assets/cardsIcons/visa.svg?react';

export const getCardBrandIcon = (type: string) => {
  switch (type) {
    case 'amex':
      return <Amex />;
    case 'diners':
      return <Diners />;
    case 'discover':
      return <Discover />;
    case 'hipercard':
      return <Hipercard />;
    case 'jcb':
      return <JCB />;
    case 'mastercard':
      return <Mastercard />;
    case 'unionpay':
      return <Unionpay />;
    case 'unknown':
      return <Unknown />;
    case 'visa':
      return <Visa />;
    default:
      return <Unknown />;
  }
};
