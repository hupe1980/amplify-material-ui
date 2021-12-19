import invariant from 'tiny-invariant';
import Auth from '@aws-amplify/auth';
import { ConsoleLogger as Logger } from '@aws-amplify/core';

import { useAuthContext } from './use-auth-context';
import { useCheckContact } from './use-check-contact';

const logger = new Logger('useConfirmSignIn');

export const useConfirmSignIn = () => {
  invariant(
    Auth && typeof Auth.confirmSignIn === 'function',
    'No Auth module found, please ensure @aws-amplify/auth is imported',
  );

  const { authData } = useAuthContext();
  const checkContact = useCheckContact();

  const mfaType = authData && authData.challengeName === 'SOFTWARE_TOKEN_MFA' ? 'TOTP' : 'SMS';

  const confirm = async (code: string): Promise<void> => {
    try {
      await Auth.confirmSignIn(authData, code, mfaType === 'TOTP' ? 'SOFTWARE_TOKEN_MFA' : null);
      checkContact(authData);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  };

  return {
    confirm,
    mfaType,
  };
};
