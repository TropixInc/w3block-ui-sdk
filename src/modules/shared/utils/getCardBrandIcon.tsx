import Amex from '../assets/cardsIcons/amex.svg';
import Diners from '../assets/cardsIcons/diners.svg';
import Discover from '../assets/cardsIcons/discover.svg';
import Hipercard from '../assets/cardsIcons/hipercard.svg';
import JCB from '../assets/cardsIcons/jcb.svg';
import Mastercard from '../assets/cardsIcons/mastercard.svg';
import Unionpay from '../assets/cardsIcons/unionpay.svg';
import Unknown from '../assets/cardsIcons/unknown.svg';
import Visa from '../assets/cardsIcons/visa.svg';

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
