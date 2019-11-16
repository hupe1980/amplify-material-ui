import * as React from 'react';

import { AuthContext, AuthContextProps } from '../auth-context';
import { NotificationProvider } from '../notification-provider';

export const withContext = Component => (
    props?: AuthContextProps,
): JSX.Element => {
    const handleStateChange = jest.fn();

    return (
        <AuthContext.Provider
            value={{
                handleStateChange: handleStateChange,
                ...props,
            }}
        >
            <NotificationProvider>{Component}</NotificationProvider>
        </AuthContext.Provider>
    );
};
