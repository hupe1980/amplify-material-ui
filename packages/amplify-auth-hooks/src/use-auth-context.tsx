import * as React from 'react';

export type AuthData = any;

export interface AuthState {
  authState: string;
  authData?: AuthData;
}

export interface AuthContextProps extends AuthState {
  handleStateChange: (authState: string, authData: AuthData) => void;
}

function createNamedContext<T>(name: string, defaultValue: T): React.Context<T> {
  const context = React.createContext<T>(defaultValue);
  context.displayName = name;

  return context;
}

export const AuthContext = createNamedContext<AuthContextProps | null>('Auth', null);

export const useAuthContext = (): AuthContextProps => React.useContext(AuthContext) as AuthContextProps;
