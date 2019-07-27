import * as React from 'react';
import { AuthProps } from './auth-props';
import { ForgotPassword } from './forgot-password';
import { Greetings } from './greetings';
import { Loading } from './loading';
import { SignIn } from './sign-in';
import { SignUp } from './sign-up';

export interface AuthenticatorProps extends AuthProps {
    hideDefault?: boolean;
}

export const Authenticator: React.FC<AuthenticatorProps> = props => {
    const { authState, onStateChange } = props;

    const default_children = [
        ForgotPassword,
        Greetings,
        Loading,
        SignIn,
        SignUp,
    ];

    const render_children = default_children.map((child, index) => {
        return React.createElement(child, {
            key: 'amplify-material-ui-authenticator-default-children-' + index,
            authState,
            onStateChange,
        });
    });

    return <>{render_children}</>;
};
