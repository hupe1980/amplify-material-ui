import * as React from 'react';
import { CssBaseline, createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

import Authenticator from './authenticator';

export { default as Authenticator } from './authenticator';
export { default as SignIn } from './sign-in';
export { default as Loading } from './loading';

export function withAuthenticator(
    Comp: React.ComponentType,
    includeGreetings = false,
    authenticatorComponents = [],
    federated = null,
    theme = {},
    signUpConfig = {},
): React.ComponentType {
    return () => {
        return (
            <ThemeProvider theme={createMuiTheme(theme)}>
                <CssBaseline />
                <Authenticator />
                <Comp />
            </ThemeProvider>
        );
    };
}
