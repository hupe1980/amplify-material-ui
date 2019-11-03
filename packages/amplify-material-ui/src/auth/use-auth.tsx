import * as React from 'react';
import invariant from 'tiny-invariant';
import useIsMounted from 'react-is-mounted-hook';
import Auth from '@aws-amplify/auth';
import { Hub } from '@aws-amplify/core';
import { HubCapsule } from '@aws-amplify/core/lib/Hub';

export const useAuth = (initialAuthState: string) => {
    const isMounted = useIsMounted();

    const [state, setState] = React.useState({
        authState: initialAuthState,
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
                handleStateChange(initialAuthState, null);
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

        return (): void => {
            Hub.remove('auth', handleAuthCapsule);
        };
    });

    return {
        ...state,
        handleStateChange,
    };
};
