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

import { Toast, ToastProps } from '../ui';

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

export interface AuthenticatorProps {
    hide?: React.FC[];
    theme?: Theme;
    hideSignUpLink?: boolean;
    hideForgotPasswordLink?: boolean;
    initialAuthState?: string;
}

export interface MessasgeState {
    message: string;
    variant: ToastProps['variant'];
}

export const Authenticator: React.FC<AuthenticatorProps> = props => {
    const {
        hide = [],
        children,
        theme,
        hideSignUpLink = false,
        hideForgotPasswordLink = false,
        initialAuthState = 'signIn',
    } = props;

    const [message, setMessage] = React.useState<MessasgeState>({
        message: '',
        variant: 'info',
    });

    const [open, setOpen] = React.useState(false);

    const { authState, authData, handleStateChange } = useAuth(
        initialAuthState,
    );

    const handleMessage = (messageState: MessasgeState): void => {
        setMessage(messageState);
        setOpen(true);
    };

    const handleClose = (
        _event?: React.SyntheticEvent,
        reason?: string,
    ): void => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        setMessage({ message: '', variant: 'info' });
    };

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
                onMessage: handleMessage,
                hideSignUpLink,
                hideForgotPasswordLink,
            }}
        >
            <ThemeProvider theme={createMuiTheme(theme)}>
                <CssBaseline />
                <Toast {...message} open={open} onClose={handleClose} />
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
        hideSignUpLink,
        hideForgotPasswordLink,
        initialAuthState,
    } = authenticatorProps;

    return (
        <Authenticator
            hide={hide}
            theme={theme}
            hideSignUpLink={hideSignUpLink}
            hideForgotPasswordLink={hideForgotPasswordLink}
            initialAuthState={initialAuthState}
        >
            <AuthRoute validAuthStates={['signedIn']}>
                {(): React.ReactElement => <Component {...props} />}
            </AuthRoute>
        </Authenticator>
    );
};
