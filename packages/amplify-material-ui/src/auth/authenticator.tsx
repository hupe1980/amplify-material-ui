import * as React from 'react';

import { IntlProvider, IntlProviderProps } from '../i18n';
import {
  NotificationProvider,
  NotificationProviderProps,
} from '../notification';
import { ThemeProvider, ThemeProviderProps } from '../ui';
import { AuthRoute } from './auth-route';
import { AuthRouter, AuthRouterProps } from './auth-router';

export interface AuthenticatorProps
  extends AuthRouterProps,
    ThemeProviderProps {
  intlProps?: IntlProviderProps;
  notificationProps?: NotificationProviderProps;
}

export const Authenticator: React.FC<AuthenticatorProps> = props => {
  const {
    children,
    intlProps,
    notificationProps,
    theme,
    ...authConfig
  } = props;

  return (
    <IntlProvider {...intlProps}>
      <NotificationProvider {...notificationProps}>
        <ThemeProvider theme={theme}>
          <AuthRouter {...authConfig}>{children}</AuthRouter>
        </ThemeProvider>
      </NotificationProvider>
    </IntlProvider>
  );
};

export const withAuthenticator = (
  Component: React.ComponentType,
  authenticatorProps: AuthenticatorProps = {}
): React.ComponentType => (props): React.ReactElement => (
  <Authenticator {...authenticatorProps}>
    <AuthRoute validAuthStates={['signedIn']}>
      {(authConfigProps): React.ReactElement => (
        <Component {...authConfigProps} {...props} />
      )}
    </AuthRoute>
  </Authenticator>
);
