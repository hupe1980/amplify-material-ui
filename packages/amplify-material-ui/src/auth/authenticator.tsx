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
import { ConfirmSignUp } from './confirm-sign-up';
import { VerifyContact } from './verify-contact';
import { AuthRoute } from './auth-route';
import { AuthContext } from './auth-context';
import { useAuth } from './use-auth';

export interface AuthenticatorProps {
    hide?: React.FC<any>[];
    theme?: Theme;
    hideSignUp?: boolean;
    hideForgotPassword?: boolean;
    initialAuthState?: string;
}

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
        validAuthStates: ['verifyContact'],
        component: VerifyContact,
    },
    {
        validAuthStates: ['confirmSignIn'],
        component: ConfirmSignIn,
    },
    {
        validAuthStates: ['confirmSignUp'],
        component: ConfirmSignUp,
    },
];

export const Authenticator: React.FC<AuthenticatorProps> = props => {
    const {
        hide = [],
        children,
        theme,
        hideSignUp = false,
        hideForgotPassword = false,
        initialAuthState = 'signIn',
    } = props;

    const { authState, authData, handleStateChange } = useAuth(
        initialAuthState,
    );

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
            value={{
                authState: authState,
                authData: authData,
                onStateChange: handleStateChange,
                hideSignUp,
                hideForgotPassword,
            }}
        >
            <ThemeProvider theme={createMuiTheme(theme)}>
                <CssBaseline />
                {renderChildren}
                {children}
            </ThemeProvider>
        </AuthContext.Provider>
    );
};

export const withAuthenticator = (
    Component: React.ComponentType,
    authenticatorProps: AuthenticatorProps = {},
): React.ComponentType => (props): React.ReactElement => {
    const {
        hide,
        theme,
        hideSignUp,
        hideForgotPassword,
        initialAuthState,
    } = authenticatorProps;

    return (
        <Authenticator
            hide={hide}
            theme={theme}
            hideSignUp={hideSignUp}
            hideForgotPassword={hideForgotPassword}
            initialAuthState={initialAuthState}
        >
            <AuthRoute validAuthStates={['signedIn']}>
                {(): React.ReactElement => <Component {...props} />}
            </AuthRoute>
        </Authenticator>
    );
};
