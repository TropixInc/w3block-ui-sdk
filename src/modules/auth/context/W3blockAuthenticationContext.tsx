/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from "react";
import { IW3blockAuthenticationContext } from "../../shared/interfaces/IW3blockAuthenticationContext";


export const W3blockAuthenticationContext = createContext(
  {} as IW3blockAuthenticationContext
);
