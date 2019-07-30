import * as React from 'react';
import { CssBaseline, createMuiTheme, Theme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

import { ForgotPassword } from './forgot-password';
import { Greetings } from './greetings';
import { Loading } from './loading';
import { SignIn } from './sign-in';
import { SignUp } from './sign-up';
import { RequireNewPassword } from './require-new-password';
import { ConfirmSignIn } from './confirm-sign-in';
import { AuthRoute } from './auth-route';
import { AuthContext } from './auth-context';

import { useAuth } from '../hooks';

import { AuthComponent, AuthProps } from './types';

const defaultChildren = [
    {
        validAuthStates: ['forgotPassword'],
        component: ForgotPassword,
    },
    {
        validAuthStates: ['signedIn'],
        component: Greetings,
    },
    {
        validAuthStates: ['loading'],
        component: Loading,
    },
    {
        validAuthStates: ['signIn', 'signedOut', 'signedUp'],
        component: SignIn,
    },
    {
        validAuthStates: ['signUp'],
        component: SignUp,
    },
    {
        validAuthStates: ['requireNewPassword'],
        component: RequireNewPassword,
    },
    {
        validAuthStates: ['confirmSignIn'],
        component: ConfirmSignIn,
    },
];

export interface AuthenticatorProps {
    hide?: AuthComponent<AuthProps>[];
    theme?: Theme;
}

export const Authenticator: React.FC<AuthenticatorProps> = props => {
    const { hide = [], children, theme } = props;

    const { authState, authData, handleStateChange } = useAuth();

    const renderChildren = defaultChildren
        .filter(item => !hide.includes(item.component))
        .map((item, index) => (
            <AuthRoute
                key={`amplify-material-ui-authenticator-default-children-${index}`}
                {...item}
            />
        ));

    return (
        <AuthContext.Provider
            value={{ authState, authData, onStateChange: handleStateChange }}
        >
            <ThemeProvider theme={createMuiTheme(theme)}>
                <CssBaseline />
                {renderChildren}
                {children}
            </ThemeProvider>
        </AuthContext.Provider>
    );
};
