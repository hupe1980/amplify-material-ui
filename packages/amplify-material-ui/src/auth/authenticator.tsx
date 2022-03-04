import * as React from 'react';

import { IntlProvider, IntlProviderProps } from '../i18n';
import { NotificationProvider, NotificationProviderProps } from '../notification';
import { ThemeProvider, ThemeProviderProps } from '../ui';
import { StyledEngineProvider } from '@mui/system';
import { AuthRoute } from './auth-route';
import { AuthRouter, AuthRouterProps } from './auth-router';
import { SignUpConfig } from './sign-up';
import { OverrideComponents, OverrideProvider } from '../ui/override-provider';

export interface AuthenticatorProps extends AuthRouterProps, ThemeProviderProps {
  intlProps?: IntlProviderProps;
  notificationProps?: NotificationProviderProps;
  signUpConfig?: SignUpConfig;
  overrides?: OverrideComponents
}

export const Authenticator: React.FC<AuthenticatorProps> = (props) => {
  const { children, intlProps, notificationProps, theme, overrides, ...authConfig } = props;

  return (
    <IntlProvider {...intlProps}>
      <NotificationProvider {...notificationProps}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <OverrideProvider {...overrides}>
              <AuthRouter {...authConfig}>{children}</AuthRouter>
            </OverrideProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </NotificationProvider>
    </IntlProvider>
  );
};

export const withAuthenticator =
  (Component: React.ComponentType, authenticatorProps: AuthenticatorProps = {}): React.ComponentType =>
  (props): React.ReactElement =>
    (
      <Authenticator {...authenticatorProps}>
        <AuthRoute validAuthStates={['signedIn']}>
          {(authConfigProps): React.ReactElement => <Component {...authConfigProps} {...props} />}
        </AuthRoute>
      </Authenticator>
    );
