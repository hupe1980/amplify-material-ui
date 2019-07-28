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

import { useAuth } from '../hooks';

import { AuthComponent, AuthProps } from './types';

export interface AuthenticatorProps {
    hideDefault?: boolean;
    hide?: AuthComponent<AuthProps>[];
    theme?: Theme;
    children: (props: AuthProps) => React.ReactElement<any>;
}

export const Authenticator: React.FC<AuthenticatorProps> = props => {
    const { hide = [], hideDefault = false, children, theme } = props;

    const { authState, authData, handleStateChange } = useAuth();

    let defaultChildren = hideDefault
        ? []
        : [
              ForgotPassword,
              Greetings,
              Loading,
              SignIn,
              SignUp,
              RequireNewPassword,
              ConfirmSignIn,
          ];

    defaultChildren = defaultChildren.filter(child => !hide.includes(child));

    const renderChildren: any = [];

    defaultChildren.forEach((child, index) => {
        if (child.validAuthStates.includes(authState)) {
            renderChildren.push(
                React.createElement(child, {
                    key: `amplify-material-ui-authenticator-default-children-${index}`,
                    authState,
                    authData,
                    onStateChange: handleStateChange,
                }),
            );
        }
    });

    return (
        <ThemeProvider theme={createMuiTheme(theme)}>
            <CssBaseline />
            {renderChildren}
            {children &&
                children({
                    authState,
                    authData,
                    onStateChange: handleStateChange,
                })}
        </ThemeProvider>
    );
};
