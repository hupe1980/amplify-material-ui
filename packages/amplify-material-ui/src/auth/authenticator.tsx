import * as React from 'react';

import { CssBaseline, createMuiTheme, Theme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

import { NotificationProvider } from './notification-provider';
import { AuthProvider, AuthProviderProps } from './auth-provider';
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
import { Notification } from './notification';

const defaultChildren = [
    {
        validAuthStates: ['*'],
        component: Notification,
    },
    {
        validAuthStates: ['loading'],
        component: Loading,
    },
    {
        validAuthStates: ['forgotPassword'],
        component: ForgotPassword,
    },
    {
        validAuthStates: ['signedIn'],
        component: Greetings,
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

export interface AuthenticatorProps extends AuthProviderProps {
    hide?: React.FC[];
    theme?: Theme;
    hideSignUpLink?: boolean;
    hideForgotPasswordLink?: boolean;
}

export const Authenticator: React.FC<AuthenticatorProps> = props => {
    const {
        hide = [],
        children,
        theme,
        hideSignUpLink,
        hideForgotPasswordLink,
        ...authProviderProps
    } = props;

    const renderChildren = defaultChildren
        .filter(item => !hide.includes(item.component))
        .map((item, index) => (
            <AuthRoute
                key={`amplify-material-ui-authenticator-default-children-${index}`}
                hideSignUpLink={hideSignUpLink}
                hideForgotPasswordLink={hideForgotPasswordLink}
                {...item}
            />
        ));
    return (
        <AuthProvider {...authProviderProps}>
            <NotificationProvider>
                <ThemeProvider theme={createMuiTheme(theme)}>
                    <CssBaseline />
                    {renderChildren}
                    {children}
                </ThemeProvider>
            </NotificationProvider>
        </AuthProvider>
    );
};

export const withAuthenticator = (
    Component: React.ComponentType,
    authenticatorProps: AuthenticatorProps = {},
): React.ComponentType => (props): React.ReactElement => (
    <Authenticator {...authenticatorProps}>
        <AuthRoute validAuthStates={['signedIn']}>
            {(authRouteProps): React.ReactElement => (
                <Component {...authRouteProps} {...props} />
            )}
        </AuthRoute>
    </Authenticator>
);
