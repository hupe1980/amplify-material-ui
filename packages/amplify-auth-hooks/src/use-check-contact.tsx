import invariant from 'tiny-invariant';
import Auth from '@aws-amplify/auth';

import { isEmptyObject } from './utils';
import { AuthData, useAuthContext } from './use-auth-context';

export const useCheckContact = (): ((authData: AuthData) => Promise<void>) => {
  const { handleStateChange } = useAuthContext();

  return async (authData: AuthData): Promise<void> => {
    invariant(
      Auth && typeof Auth.verifiedContact === 'function',
      'No Auth module found, please ensure @aws-amplify/auth is imported',
    );

    const data = await Auth.verifiedContact(authData);

    if (!isEmptyObject(data.verified)) {
      handleStateChange('signedIn', authData);
    } else {
      const newUser = Object.assign(authData, data);
      handleStateChange('verifyContact', newUser);
    }
  };
};
