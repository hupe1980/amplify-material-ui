import * as React from 'react';
import { useAuth, AuthContext, AuthProps } from 'amplify-auth-hooks';

export const AuthProvider: React.FC<AuthProps> = (props) => {
  const { children, ...authProviderProps } = props;

  const authContexProviderProps = useAuth(authProviderProps);

  return (
    <AuthContext.Provider value={authContexProviderProps}>
      {children}
    </AuthContext.Provider>
  );
};
