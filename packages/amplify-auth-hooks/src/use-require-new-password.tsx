import invariant from 'tiny-invariant';
import Auth from '@aws-amplify/auth';
import { ConsoleLogger as Logger } from '@aws-amplify/core';

import { useAuthContext } from './use-auth-context';
import { useCheckContact } from './use-check-contact';

const logger = new Logger('useRequireNewPassword');

export const useRequireNewPassword = (): ((password: string) => Promise<void>) => {
  invariant(
    Auth && typeof Auth.completeNewPassword === 'function',
    'No Auth module found, please ensure @aws-amplify/auth is imported',
  );

  const { authData: user, handleStateChange } = useAuthContext();
  const checkContact = useCheckContact();

  return async (password: string): Promise<void> => {
    //const { requiredAttributes } = user.challengeParam;
    //const attrs = objectWithProperties(this.inputs, requiredAttributes);

    try {
      const updatedUser = await Auth.completeNewPassword(user, password, undefined);

      logger.debug('complete new password', updatedUser);

      if (updatedUser.challengeName === 'SMS_MFA') {
        handleStateChange('confirmSignIn', updatedUser);
      } else if (updatedUser.challengeName === 'MFA_SETUP') {
        logger.debug('TOTP setup', updatedUser.challengeParam);
        handleStateChange('TOTPSetup', updatedUser);
      } else {
        checkContact(updatedUser);
      }
    } catch (error) {
      logger.error(error);
      throw error;
    }
  };
};
