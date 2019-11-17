import * as React from 'react';

import { IntlProvider } from '../../i18n';
import { AuthContext, AuthContextProps } from '../auth-context';
import { NotificationProvider } from '../notification-provider';

export const withContext = Component => (
    props?: AuthContextProps,
): JSX.Element => {
    const handleStateChange = jest.fn();

    return (
        <IntlProvider>
            <NotificationProvider>
                <AuthContext.Provider
                    value={{
                        handleStateChange: handleStateChange,
                        ...props,
                    }}
                >
                    {Component}
                </AuthContext.Provider>
            </NotificationProvider>
        </IntlProvider>
    );
};
