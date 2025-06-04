import { ReactNode } from "react";

export interface IOption {
    label: string;
    value: string | any;
    icon?: ReactNode;
    disabled?: boolean;
    image?: string;
    subtitle?: string;
  }