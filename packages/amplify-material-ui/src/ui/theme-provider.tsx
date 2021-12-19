import * as React from 'react';
import { CssBaseline } from '@material-ui/core';
import { Theme, ThemeProvider as MUIThemeProvider, createTheme, responsiveFontSizes } from '@material-ui/core/styles';

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
