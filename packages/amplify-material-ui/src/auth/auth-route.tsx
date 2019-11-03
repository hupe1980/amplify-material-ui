import * as React from 'react';

import { useAuthContext, AuthContextProps } from './auth-context';

export interface AuthRouteProps {
    validAuthStates: string[];
    component?: React.FC<any>;
    children?: (props: AuthContextProps) => React.ReactElement;
}

export const AuthRoute: React.FC<AuthRouteProps> = props => {
    const { validAuthStates, component, children } = props;

    const { authState, ...rest } = useAuthContext();

    const match = validAuthStates.includes(authState);

    return match
        ? component
            ? React.createElement(component, { authState, ...rest })
            : children
            ? children({ authState, ...rest })
            : null
        : null;
};
