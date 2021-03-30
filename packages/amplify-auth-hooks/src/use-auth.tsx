import * as React from 'react';
import invariant from 'tiny-invariant';
import Auth from '@aws-amplify/auth';
import { Hub } from '@aws-amplify/core';
import { HubCapsule } from '@aws-amplify/core/lib/Hub';
import { isEmptyObject } from './utils';

import { AuthData, AuthState, AuthContextProps } from './use-auth-context';

export interface AuthProps {
  initialAuthState?: string;
  onStateChange?: (prevState: AuthState, newState: AuthState) => AuthState;
}

export const useAuth = (props: AuthProps): AuthContextProps => {
  invariant(
    Auth && typeof Auth.currentAuthenticatedUser === 'function',
    'No Auth module found, please ensure @aws-amplify/auth is imported'
  );

  const { initialAuthState = 'signIn', onStateChange, forceVerify } = props;

  const [state, setState] = React.useState<AuthState>({
    authState: initialAuthState,
    authData: null,
  });

  const handleStateChange = React.useCallback(
    (authState: string, authData: AuthData) => {
      if (authState === 'signedOut') {
        authState = 'signIn';
      }

      setState((prev) => {
        const newState = onStateChange
          ? onStateChange(prev, { authState, authData })
          : { authState, authData };
        return {
          ...prev,
          ...newState,
        };
      });
    },
    [onStateChange]
  );

  React.useEffect(() => {
    const checkUser = async (): Promise<void> => {
      try {
        const codeRequested = JSON.parse(
          localStorage.getItem('codeRequested') ?? 'false'
        );
        const user = await Auth.currentAuthenticatedUser();
        const verifiedData = await Auth.verifiedContact(user);
        const userWithVerify = { ...user, ...verifiedData };

        if (
          isEmptyObject(verifiedData.verified) &&
          forceVerify &&
          codeRequested
        ) {
          handleStateChange('submitCode', userWithVerify);
        }

        if (isEmptyObject(verifiedData.verified) && forceVerify) {
          handleStateChange('verifyContact', userWithVerify);
        }

        if (!isEmptyObject(verifiedData.verified)) {
          handleStateChange('signedIn', userWithVerify);
        }
      } catch (error) {
        handleStateChange(initialAuthState, null);
      }
    };
    checkUser();
  }, [handleStateChange, initialAuthState]);

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
          //TODO
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
