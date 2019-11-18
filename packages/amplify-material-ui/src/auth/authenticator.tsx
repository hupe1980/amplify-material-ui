import * as React from 'react';
import { CssBaseline, Theme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { AuthProps } from 'amplify-auth-hooks';

import { defaultTheme } from '../theme';
import { IntlProvider, IntlProviderProps } from '../i18n';
import {
  NotificationProvider,
  NotificationProviderProps,
} from './notification-provider';
import { AuthProvider } from './auth-provider';
import { ForgotPassword } from './forgot-password';
import { Greetings } from './greetings';
import { Loading } from './loading';
import { SignIn } from './sign-in';
import { SignUp } from './sign-up';
import { RequireNewPassword } from './require-new-password';
import { ConfirmSignIn } from './confirm-sign-in';
import { ConfirmSignUp } from './confirm-sign-up';
import { VerifyContact } from './verify-contact';
import { AuthRoute, AuthConfig } from './auth-route';
import { Notification } from './notification';

const defaultChildren = [
  {
    validAuthStates: ['*'],
    component: Notification,
  },
  {
    validAuthStates: ['loading'],
    component: Loading,
  },
  {
    validAuthStates: ['forgotPassword'],
    component: ForgotPassword,
  },
  {
    validAuthStates: ['signedIn'],
    component: Greetings,
  },
  {
    validAuthStates: ['signIn', 'signedOut', 'signedUp'],
    component: SignIn,
  },
  {
    validAuthStates: ['signUp'],
    component: SignUp,
  },
  {
    validAuthStates: ['requireNewPassword'],
    component: RequireNewPassword,
  },
  {
    validAuthStates: ['verifyContact'],
    component: VerifyContact,
  },
  {
    validAuthStates: ['confirmSignIn'],
    component: ConfirmSignIn,
  },
  {
    validAuthStates: ['confirmSignUp'],
    component: ConfirmSignUp,
  },
];

export interface AuthenticatorProps extends AuthProps, AuthConfig {
  hide?: React.FC[];
  theme?: Theme;
  intlProps?: IntlProviderProps;
  notificationProps?: NotificationProviderProps;
}

export const Authenticator: React.FC<AuthenticatorProps> = props => {
  const {
    hide = [],
    children,
    theme,
    initialAuthState,
    onStateChange,
    intlProps,
    notificationProps,
    ...authConfig
  } = props;

  const renderChildren = defaultChildren
    .filter(item => !hide.includes(item.component))
    .map((item, index) => (
      <AuthRoute
        key={`amplify-material-ui-authenticator-default-children-${index}`}
        {...item}
        {...authConfig}
      />
    ));
  return (
    <IntlProvider {...intlProps}>
      <NotificationProvider {...notificationProps}>
        <AuthProvider
          initialAuthState={initialAuthState}
          onStateChange={onStateChange}
        >
          <ThemeProvider theme={{ ...defaultTheme, ...theme }}>
            <CssBaseline />
            {renderChildren}
            {children}
          </ThemeProvider>
        </AuthProvider>
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
