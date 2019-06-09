import * as React from 'react';
import ForgotPassword from './forgot-password';
import Greetings from './greetings';
import Loading from './loading';
import SignIn from './sign-in';
import SignUp from './sign-up';

import { useAuth } from '../hooks';

export interface AuthenticatorProps {}

const Authenticator: React.FC<AuthenticatorProps> = props => {
    const { authState, handleStateChange } = useAuth();

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
            onStateChange: handleStateChange,
        });
    });

    return <div>{render_children}</div>;
};

export default Authenticator;
