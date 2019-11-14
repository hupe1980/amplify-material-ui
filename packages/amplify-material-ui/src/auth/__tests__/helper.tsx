import * as React from 'react';

import { AuthContext } from '../auth-context';

export const withContext = Component => (props?: any) => {
    const handleStateChange = jest.fn();
    const handleMessage = jest.fn();

    return (
        <AuthContext.Provider
            value={{
                onStateChange: handleStateChange,
                onMessage: handleMessage,
                ...props,
            }}
        >
            {Component}
        </AuthContext.Provider>
    );
};
