import * as React from 'react';
import { AuthContext, AuthContextProps } from 'amplify-auth-hooks';

import { IntlProvider } from '../../src';
import { NotificationProvider } from '../../src';

export const withContext = (Component: React.ReactElement) => (
  props?: AuthContextProps
): JSX.Element => {
  const handleStateChange = jest.fn();
  const authState = 'signIn';

  return (
    <IntlProvider>
      <NotificationProvider>
        <AuthContext.Provider
          value={{
            handleStateChange,
            authState,
            ...props,
          }}
        >
          {Component}
        </AuthContext.Provider>
      </NotificationProvider>
    </IntlProvider>
  );
};
