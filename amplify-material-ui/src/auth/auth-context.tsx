import * as React from 'react';

import { AuthProps } from './types';

const createNamedContext = (name: string) => {
    const context = React.createContext<AuthProps | null>(null);
    context.displayName = name;

    return context;
};

export const AuthContext = createNamedContext('Auth');

export const useAuthContext = () => React.useContext(AuthContext) as AuthProps;
