import * as React from 'react';

import { useAuthContext, AuthContextProps } from './auth-context';

export interface AuthRouteProps {
    validAuthStates: string[];
    component?: React.FC<any>;
    render?: (props: AuthContextProps) => any; //TODO
}

export const AuthRoute: React.FC<AuthRouteProps> = props => {
    const { validAuthStates, component, render } = props;

    const { authState, ...rest } = useAuthContext();

    const match = validAuthStates.includes(authState);

    return match
        ? component
            ? React.createElement(component, { authState, ...rest })
            : render
            ? render({ authState, ...rest })
            : null
        : null;
};
