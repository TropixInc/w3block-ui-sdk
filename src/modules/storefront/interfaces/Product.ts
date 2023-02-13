import { AssetInterface } from '.';

export interface Product {
  id: string;
  img: AssetInterface;
  name: string;
  category: string;
  description: string;
  price: string;
}
