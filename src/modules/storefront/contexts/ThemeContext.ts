'use client';

import { IThemeContext } from "../../shared/interfaces/IThemeContext";
import { createSymlinkSafeContext } from "../../shared/utils/createSymlinkSafeContext";

export const ThemeContext = createSymlinkSafeContext<IThemeContext | null>(
  '__THEME_CONTEXT__',
  null
); 