import * as React from 'react';

import { Authenticator } from './authenticator';
import { AuthRoute } from './auth-route';

import { Theme } from '@material-ui/core';

export interface AuthConfig {
    hide?: React.FC<any>[];
    theme?: Theme;
}

export const withAuthenticator = (
    Component: React.ComponentType,
    authConfig?: AuthConfig,
): React.ComponentType<any> => {
    return props => {
        const { hide = [], theme = undefined } = authConfig || {};

        return (
            <Authenticator hide={hide} theme={theme}>
                <AuthRoute
                    validAuthStates={['signedIn']}
                    render={({ authState, authData, onStateChange }) => (
                        <Component
                            {...props}
                            authState={authState}
                            authData={authData}
                            onStateChange={onStateChange}
                        />
                    )}
                />
            </Authenticator>
        );
    };
};
