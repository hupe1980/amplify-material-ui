import * as React from 'react';
import invariant from 'tiny-invariant';
import useIsMounted from 'react-is-mounted-hook';
import { Hub } from '@aws-amplify/core';
import { HubCapsule } from '@aws-amplify/core/lib/Hub';
import Auth from '@aws-amplify/auth';

import { CssBaseline, createMuiTheme, Theme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

import { ForgotPassword } from './forgot-password';
import { Greetings } from './greetings';
import { Loading } from './loading';
import { SignIn } from './sign-in';
import { SignUp } from './sign-up';
import { RequireNewPassword } from './require-new-password';
import { ConfirmSignIn } from './confirm-sign-in';
import { VerifyContact } from './verify-contact';
import { AuthRoute } from './auth-route';
import { AuthContext } from './auth-context';

export interface AuthenticatorProps {
    hide?: React.FC<any>[];
    theme?: Theme;
    hideSignUp?: boolean;
    hideForgotPassword?: boolean;
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
];

export const Authenticator: React.FC<AuthenticatorProps> = props => {
    const {
        hide = [],
        children,
        theme,
        hideSignUp = false,
        hideForgotPassword = false,
    } = props;

    const isMounted = useIsMounted();

    const [state, setState] = React.useState({
        authState: 'loading',
        authData: null,
    });

    const handleStateChange = React.useCallback(
        (authState: string, authData: any) => {
            if (authState === 'signedOut') {
                authState = 'signIn';
            }

            if (isMounted()) {
                setState(prevState => ({
                    ...prevState,
                    authState,
                    authData,
                }));
            }
        },
        [isMounted],
    );

    React.useEffect(() => {
        const checkUser = async (): Promise<void> => {
            invariant(
                Auth && typeof Auth.currentAuthenticatedUser === 'function',
                'No Auth module found, please ensure @aws-amplify/auth is imported',
            );

            try {
                const user = await Auth.currentAuthenticatedUser();
                if (!isMounted()) return;
                handleStateChange('signedIn', user);
            } catch (error) {
                if (!isMounted()) return;
                handleStateChange('signIn', null);
            }
        };
        checkUser();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const handleAuthCapsule = (capsule: HubCapsule): void => {
            const { payload } = capsule;

            switch (payload.event) {
                case 'cognitoHostedUI':
                    handleStateChange('signedIn', payload.data);
                    break;
                case 'cognitoHostedUI_failure':
                    handleStateChange('signIn', null);
                    break;
                case 'parsingUrl_failure':
                    handleStateChange('signIn', null);
                    break;
                case 'signOut':
                    handleStateChange('signIn', null);
                    break;
                case 'customGreetingSignOut':
                    handleStateChange('signIn', null);
                    break;
                default:
                    break;
            }
        };
        Hub.listen('auth', handleAuthCapsule);

        return () => {
            Hub.remove('auth', handleAuthCapsule);
        };
    });

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
                ...state,
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
    authenticatorProps?: AuthenticatorProps,
): React.ComponentType<any> => {
    return props => {
        const {
            hide = [],
            theme = undefined,
            hideSignUp = false,
            hideForgotPassword = false,
        } = authenticatorProps || {};

        return (
            <Authenticator
                hide={hide}
                theme={theme}
                hideSignUp={hideSignUp}
                hideForgotPassword={hideForgotPassword}
            >
                <AuthRoute
                    validAuthStates={['signedIn']}
                    render={() => <Component {...props} />}
                />
            </Authenticator>
        );
    };
};
