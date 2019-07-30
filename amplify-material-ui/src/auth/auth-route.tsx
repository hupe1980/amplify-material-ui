import * as React from 'react';
import { AuthContext } from './auth-context';
import { AuthProps, AuthComponent } from './types';

export interface AuthRouteProps {
    validAuthStates: string[];
    component?: AuthComponent<AuthProps>;
    render?: (props: AuthProps) => any; //TODO
}

export const AuthRoute: React.FC<AuthRouteProps> = props => {
    const { validAuthStates, component, render } = props;

    const { authState, ...rest } = React.useContext(AuthContext) as AuthProps;

    const match = validAuthStates.includes(authState);

    return match
        ? component
            ? React.createElement(component, { authState, ...rest })
            : render
            ? render({ authState, ...rest })
            : null
        : null;
};
