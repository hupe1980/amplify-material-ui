import * as React from 'react';

import { Authenticator } from './authenticator';

import { AuthComponent, AuthProps } from './types';
import { Theme } from '@material-ui/core';

export interface AuthConfig {
    hide?: AuthComponent<AuthProps>[];
    hideDefault?: boolean;
    theme?: Theme;
}

export const withAuthenticator = (
    Component: React.ComponentType,
    authConfig?: AuthConfig,
): React.ComponentType<any> => {
    return props => {
        const { hide = [], hideDefault = false, theme = undefined } =
            authConfig || {};

        return (
            <Authenticator hideDefault={hideDefault} hide={hide} theme={theme}>
                {({ authState, authData, onStateChange }) => (
                    <>
                        {authState === 'signedIn' && (
                            <Component
                                {...props}
                                authState={authState}
                                authData={authData}
                                onStateChange={onStateChange}
                            />
                        )}
                    </>
                )}
            </Authenticator>
        );
    };
};
