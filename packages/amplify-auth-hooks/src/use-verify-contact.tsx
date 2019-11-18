import * as React from 'react';
import invariant from 'tiny-invariant';

import Auth from '@aws-amplify/auth';
import { ConsoleLogger as Logger } from '@aws-amplify/core';

import { useAuthContext } from './use-auth-context';
import { useNotificationContext } from './use-notification-context';

const logger = new Logger('useVerifyContact');

export const useVerifyContact = () => {
  const { handleStateChange, authData } = useAuthContext();
  const { showNotification } = useNotificationContext();
  const [verifyAttr, setVerifyAttr] = React.useState<string | null>(null);

  const verify = async (contact: string): Promise<void> => {
    invariant(
      Auth && typeof Auth.verifyCurrentUserAttribute === 'function',
      'No Auth module found, please ensure @aws-amplify/auth is imported'
    );

    try {
      const data = await Auth.verifyCurrentUserAttribute(contact);
      logger.debug(data);
      setVerifyAttr(contact);
    } catch (error) {
      logger.error(error);
      showNotification({
        content: error.message,
        variant: 'error',
      });
    }
  };

  const submit = async (code: string): Promise<void> => {
    if (!verifyAttr) {
      return;
    }

    invariant(
      Auth && typeof Auth.verifyCurrentUserAttributeSubmit === 'function',
      'No Auth module found, please ensure @aws-amplify/auth is imported'
    );

    try {
      await Auth.verifyCurrentUserAttributeSubmit(verifyAttr, code);
      handleStateChange('signedIn', authData);
      setVerifyAttr(null);
    } catch (error) {
      logger.error(error);
      showNotification({
        content: error.message,
        variant: 'error',
      });
    }
  };

  return {
    verifyAttr,
    verify,
    submit,
  };
};
