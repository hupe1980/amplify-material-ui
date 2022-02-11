import * as React from 'react';
import { CssBaseline } from '@mui/material';
import {
  Theme,
  ThemeProvider as MUIThemeProvider,
  createTheme,
  responsiveFontSizes,
} from '@mui/material/styles';

export interface ThemeProviderProps {
  theme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = (props) => {
  const { children, theme = createTheme() } = props;

  const enrichedTheme = responsiveFontSizes(theme);

  return (
    <MUIThemeProvider theme={enrichedTheme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};
