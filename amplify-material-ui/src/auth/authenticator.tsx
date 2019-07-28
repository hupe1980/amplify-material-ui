import * as React from 'react';
import { ForgotPassword } from './forgot-password';
import { Greetings } from './greetings';
import { Loading } from './loading';
import { SignIn } from './sign-in';
import { SignUp } from './sign-up';
import { RequireNewPassword } from './require-new-password';
import { ConfirmSignIn } from './confirm-sign-in';

import { AuthComponent, AuthProps } from './types';

export interface AuthenticatorProps extends AuthProps {
    hideDefault?: boolean;
    children?: AuthComponent[];
}

export const Authenticator: React.FC<AuthenticatorProps> = props => {
    const {
        authState,
        onStateChange,
        authData,
        children = [],
        hideDefault = false,
    } = props;

    const default_children = hideDefault
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

    const renderChildren: any = [];

    [...default_children, ...children].forEach((child, index) => {
        if (child.validAuthStates.includes(authState)) {
            renderChildren.push(
                React.createElement(child, {
                    key:
                        'amplify-material-ui-authenticator-default-children-' +
                        index,
                    authState,
                    authData,
                    onStateChange,
                }),
            );
        }
    });

    return <>{renderChildren}</>;
};
