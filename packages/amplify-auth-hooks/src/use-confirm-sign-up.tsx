import invariant from 'tiny-invariant';
import Auth from '@aws-amplify/auth';
import { Logger } from '@aws-amplify/core';

import { useAuthContext } from './use-auth-context';

const logger = new Logger('useConfirmSignUp');

export const useConfirmSignUp = () => {
  invariant(
    (Auth && typeof Auth.confirmSignUp === 'function') || typeof Auth.resendSignUp === 'function',
    'No Auth module found, please ensure @aws-amplify/auth is imported',
  );

  const { handleStateChange, authData = {} } = useAuthContext();

  const { username } = authData;

  const confirm = async (code: string): Promise<void> => {
    try {
      await Auth.confirmSignUp(username, code);
      handleStateChange('signedUp', null);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  };

  const resend = async (): Promise<void> => {
    try {
      await Auth.resendSignUp(username);
      logger.debug('code resent');
    } catch (error) {
      logger.error(error);
      throw error;
    }
  };

  return {
    confirm,
    resend,
  };
};
