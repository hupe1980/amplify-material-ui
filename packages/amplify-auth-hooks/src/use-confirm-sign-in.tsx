import invariant from 'tiny-invariant';
import Auth from '@aws-amplify/auth';
import { ConsoleLogger as Logger } from '@aws-amplify/core';

import { useAuthContext } from './use-auth-context';
import { useNotificationContext } from './use-notification-context';
import { useCheckContact } from './use-check-contact';

const logger = new Logger('useConfirmSignIn');

export const useConfirmSignIn = () => {
  const { authData } = useAuthContext();
  const { showNotification } = useNotificationContext();
  const checkContact = useCheckContact();

  const mfaType =
    authData && authData.challengeName === 'SOFTWARE_TOKEN_MFA'
      ? 'TOTP'
      : 'SMS';

  const confirm = async (code: string): Promise<void> => {
    invariant(
      Auth && typeof Auth.confirmSignIn === 'function',
      'No Auth module found, please ensure @aws-amplify/auth is imported'
    );

    try {
      await Auth.confirmSignIn(
        authData,
        code,
        mfaType === 'TOTP' ? 'SOFTWARE_TOKEN_MFA' : null
      );
      checkContact(authData);
    } catch (error) {
      logger.error(error);
      showNotification({ content: error.message, variant: 'error' });
    }
  };

  return {
    confirm,
    mfaType,
  };
};
