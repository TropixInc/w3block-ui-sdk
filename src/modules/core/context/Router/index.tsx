import { createContext } from "react";

export interface RouterContext {
    push: (path: string) => void;
}

export const routerContext = createContext({} as RouterContext);