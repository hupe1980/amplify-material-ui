import * as React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Theme } from '@material-ui/core/styles';
import { ThemeProvider as MUIThemeProvider } from '@material-ui/styles';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

export interface ThemeProviderProps {
  theme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = (props) => {
  const { children, theme = createMuiTheme() } = props;

  const enrichedTheme = responsiveFontSizes(theme);

  return (
    <MUIThemeProvider theme={enrichedTheme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};
