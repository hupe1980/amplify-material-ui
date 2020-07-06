import * as React from 'react';
import { AuthProps } from 'amplify-auth-hooks';

import { Notification } from '../notification';
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

export interface AuthRouterProps extends AuthProps, AuthConfig {
  hide?: React.FC[];
}

export const AuthRouter: React.FC<AuthRouterProps> = (props) => {
  const {
    hide = [],
    children,
    initialAuthState,
    onStateChange,
    ...authConfig
  } = props;

  const renderChildren = defaultChildren
    .filter((item) => !hide.includes(item.component))
    .map((item, index) => (
      <AuthRoute
        key={`amplify-material-ui-authenticator-default-children-${index}`}
        {...item}
        {...authConfig}
      />
    ));
  return (
    <AuthProvider
      initialAuthState={initialAuthState}
      onStateChange={onStateChange}
    >
      {renderChildren}
      {children}
    </AuthProvider>
  );
};
