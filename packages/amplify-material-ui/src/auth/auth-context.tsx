import * as React from 'react';

import { createNamedContext } from '../core';
import { AuthData, UsernameAttribute } from './types';

export interface AuthState {
    authState: string;
    authData?: AuthData;
}

export interface AuthConfig {
    hideSignUpLink?: boolean;
    hideForgotPasswordLink?: boolean;
    usernameAttribute?: UsernameAttribute;
}
export interface AuthContextProps extends AuthState, AuthConfig {
    handleStateChange: (authState: string, authData: AuthData) => void;
}

export const AuthContext = createNamedContext<AuthContextProps | null>(
    'Auth',
    null,
);

export const useAuthContext = (): AuthContextProps =>
    React.useContext(AuthContext) as AuthContextProps;
