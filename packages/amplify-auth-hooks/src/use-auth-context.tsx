import * as React from 'react';

import { createNamedContext } from './utils';

export type AuthData = any;

export interface AuthState {
  authState: string;
  authData?: AuthData;
}

export interface AuthContextProps extends AuthState {
  handleStateChange: (authState: string, authData: AuthData) => void;
}

export const AuthContext = createNamedContext<AuthContextProps | null>(
  'Auth',
  null
);

export const useAuthContext = (): AuthContextProps =>
  React.useContext(AuthContext) as AuthContextProps;
