import * as React from 'react';
import { CssBaseline, createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

import AuthProps from './auth-props';
import Authenticator from './authenticator';
import { useAuth } from '../hooks';

const withAuthenticator = <P extends Partial<AuthProps>>(
    Component: React.ComponentType<P>,
    includeGreetings = false,
    authenticatorComponents = [],
    federated = null,
    theme = {},
    signUpConfig = {},
): React.ComponentType<P> => {
    return props => {
        const { authState, authData, handleStateChange } = useAuth();

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
                <Component
                    {...(props as P)}
                    authState={authState}
                    authData={authData}
                    onStateChange={handleStateChange}
                />
            </ThemeProvider>
        );
    };
};

export default withAuthenticator;
