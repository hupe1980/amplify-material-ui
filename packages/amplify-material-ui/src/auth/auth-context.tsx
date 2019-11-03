import * as React from 'react';

export interface AuthContextProps {
    authState: string;
    onStateChange: (authState: string, authData: any) => void;
    authData?: any;
    hideSignUp?: boolean;
    hideForgotPassword?: boolean;
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
