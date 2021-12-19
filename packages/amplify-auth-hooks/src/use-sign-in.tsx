import invariant from 'tiny-invariant';

import Auth from '@aws-amplify/auth';
import { ConsoleLogger as Logger } from '@aws-amplify/core';

import { useAuthContext } from './use-auth-context';
import { useCheckContact } from './use-check-contact';

const logger = new Logger('useSignIn');

export const useSignIn = (): ((
  username: string,
  password: string,
  validationData?: Record<string, string>,
) => Promise<void>) => {
  invariant(
    Auth && typeof Auth.signIn === 'function',
    'No Auth module found, please ensure @aws-amplify/auth is imported',
  );

  const { handleStateChange } = useAuthContext();
  const checkContact = useCheckContact();

  return async (
    username: string,
    password: string,
    validationData?: {
      [key: string]: string;
    },
  ): Promise<void> => {
    try {
      const user = await Auth.signIn({
        username,
        password,
        validationData,
      });
      logger.debug(user);
      if (user.challengeName === 'SMS_MFA' || user.challengeName === 'SOFTWARE_TOKEN_MFA') {
        logger.debug('confirm user with ' + user.challengeName);
        handleStateChange('confirmSignIn', user);
      } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        logger.debug('require new password', user.challengeParam);
        handleStateChange('requireNewPassword', user);
      } else if (user.challengeName === 'MFA_SETUP') {
        logger.debug('TOTP setup', user.challengeParam);
        handleStateChange('TOTPSetup', user);
      } else {
        checkContact(user);
      }
    } catch (error) {
      if (error.code === 'UserNotConfirmedException') {
        logger.debug('the user is not confirmed');
        handleStateChange('confirmSignUp', { username });
      } else if (error.code === 'PasswordResetRequiredException') {
        logger.debug('the user requires a new password');
        handleStateChange('forgotPassword', { username });
      } else {
        logger.error(error);
        throw error;
      }
    }
  };
};
