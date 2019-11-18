import * as React from 'react';
import {
  AdminProps,
  CoreAdminContext,
  CoreAdminUI,
  NotFound,
} from 'react-admin';
import {
  Authenticator,
  AuthRoute,
  Greetings,
  Loading,
} from 'amplify-material-ui';
import { createBrowserHistory } from 'history';

import { Layout } from './layout';
import { defaultTheme } from './theme';

const authProvider = () => Promise.resolve();

export const Admin: React.FC<AdminProps> = ({
  catchAll = NotFound,
  children,
  dataProvider,
  history = createBrowserHistory(),
  layout = Layout,
  loading = Loading,
  title = 'AmplifyReactAdmin',
}) => {
  return (
    <Authenticator
      hide={[Greetings]}
      hideSignUpLink={true}
      theme={defaultTheme}
    >
      <AuthRoute validAuthStates={['signedIn']}>
        {(): React.ReactElement => (
          <CoreAdminContext
            authProvider={authProvider}
            dataProvider={dataProvider}
            history={history}
          >
            <CoreAdminUI
              catchAll={catchAll}
              layout={layout}
              loading={loading}
              loginPage={false}
              title={title}
            >
              {children}
            </CoreAdminUI>
          </CoreAdminContext>
        )}
      </AuthRoute>
    </Authenticator>
  );
};
