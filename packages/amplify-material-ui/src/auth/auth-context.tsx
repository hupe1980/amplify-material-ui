import * as React from 'react';

import { MessasgeState } from './authenticator';

export interface AuthContextProps {
    authState: string;
    onStateChange: (authState: string, authData: any) => void;
    onMessage: (messageState: MessasgeState) => void;
    authData?: any;
    hideSignUpLink?: boolean;
    hideForgotPasswordLink?: boolean;
}

const createNamedContext = (
    name: string,
): React.Context<AuthContextProps | null> => {
    const context = React.createContext<AuthContextProps | null>(null);
    context.displayName = name;

    return context;
};

export const AuthContext = createNamedContext('Auth');

export const useAuthContext = (): AuthContextProps =>
    React.useContext(AuthContext) as AuthContextProps;
