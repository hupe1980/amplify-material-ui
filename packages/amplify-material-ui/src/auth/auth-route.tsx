import * as React from 'react';
import { useAuthContext } from 'amplify-auth-hooks';

import { UsernameAttribute } from './types';

export interface AuthConfig {
  hideSignUpLink?: boolean;
  hideForgotPasswordLink?: boolean;
  usernameAttribute?: UsernameAttribute;
  title?: string | React.ReactElement;
}
export interface AuthRouteProps extends AuthConfig {
  validAuthStates: string[];
  component?: React.FC<AuthConfig & Record<string, any>>;
  children?: (props: AuthConfig) => React.ReactElement;
}

export const AuthRoute: React.FC<AuthRouteProps> = (props) => {
  const { validAuthStates, component, children, ...authConfig } = props;

  const { authState } = useAuthContext();

  const regExp = new RegExp(`(${authState}|\\*)`);

  const match = validAuthStates.some((validAuthStates) =>
    regExp.test(validAuthStates)
  );

  return match
    ? component
      ? React.createElement(component, authConfig)
      : children
      ? children(authConfig)
      : null
    : null;
};
