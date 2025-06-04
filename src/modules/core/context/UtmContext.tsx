import { createContext } from 'react';

export interface UtmContextInterface {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  expires?: number;
}

export const UtmContext = createContext<UtmContextInterface>({});
