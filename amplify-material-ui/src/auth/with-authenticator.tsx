import * as React from 'react';
import { CssBaseline, createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

import AuthProps from './auth-props';
import { Authenticator } from './authenticator';
import { useAuth } from '../hooks';

const defaultAuthConfig = {
    includeGreetings: false,
    authenticatorComponents: [],
    federated: {},
    theme: {},
    signUpConfig: {},
};

export interface AuthConfig {
    includeGreetings?: boolean;
    authenticatorComponents?: [React.ComponentType];
    federated?: object;
    theme?: object;
    signUpConfig?: object;
}

export const withAuthenticator = <P extends Partial<AuthProps>>(
    Component: React.ComponentType<P>,
    authConfig?: AuthConfig,
): React.ComponentType<P> => {
    return props => {
        const { authState, authData, handleStateChange } = useAuth();
        const {
            includeGreetings = false,
            authenticatorComponents = [],
            federated = {},
            theme = {},
            signUpConfig = {},
        } = {
            ...defaultAuthConfig,
            ...authConfig,
        };

        return (
            <ThemeProvider theme={createMuiTheme(theme)}>
                <CssBaseline />
                <Authenticator
                    authState={authState}
                    hideDefault={
                        authenticatorComponents &&
                        authenticatorComponents.length > 0
                    }
                    onStateChange={handleStateChange}
                />
                {authState === 'signedIn' && (
                    <Component
                        {...(props as P)}
                        authState={authState}
                        authData={authData}
                        onStateChange={handleStateChange}
                    />
                )}
            </ThemeProvider>
        );
    };
};
