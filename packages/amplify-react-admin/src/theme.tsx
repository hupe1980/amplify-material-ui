import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    drawerWidth: number;
  }
  interface ThemeOptions {
    drawerWidth: number;
  }
}

export const defaultTheme = createMuiTheme({
  drawerWidth: 240,
});
