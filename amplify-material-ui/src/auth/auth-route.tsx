import * as React from 'react';

import { useAuthContext } from './auth-context';
import { AuthProps } from './types';

export interface AuthRouteProps {
    validAuthStates: string[];
    component?: React.FC<any>;
    render?: (props: AuthProps) => any; //TODO
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
