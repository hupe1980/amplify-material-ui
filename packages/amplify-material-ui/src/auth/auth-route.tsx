import * as React from 'react';

import { useAuthContext, AuthContextProps } from './auth-context';

export interface AuthRouteProps {
    validAuthStates: string[];
    component?: React.FC;
    children?: (props: AuthContextProps) => React.ReactElement;
    [key: string]: any;
}

export const AuthRoute: React.FC<AuthRouteProps> = props => {
    const { validAuthStates, component, children, ...authRouteProps } = props;

    const { authState, ...rest } = useAuthContext();

    const regExp = new RegExp(`(${authState}|\\*)`);

    const match = validAuthStates.some(validAuthStates =>
        regExp.test(validAuthStates),
    );

    return match
        ? component
            ? React.createElement(component, authRouteProps)
            : children
            ? children({ authState, ...rest, ...authRouteProps })
            : null
        : null;
};
