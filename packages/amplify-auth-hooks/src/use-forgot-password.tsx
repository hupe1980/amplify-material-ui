import * as React from 'react';
import invariant from 'tiny-invariant';
import Auth from '@aws-amplify/auth';
import { ConsoleLogger as Logger } from '@aws-amplify/core';

import { useAuthContext } from './use-auth-context';
import { useNotificationContext } from './use-notification-context';

const logger = new Logger('useForgotPassword');

export const useForgotPassword = () => {
  const [delivery, setDelivery] = React.useState(null);
  const { handleStateChange } = useAuthContext();
  const { showNotification } = useNotificationContext();

  const submit = async (
    code: string,
    username: string,
    password: string
  ): Promise<void> => {
    invariant(
      Auth && typeof Auth.forgotPasswordSubmit === 'function',
      'No Auth module found, please ensure @aws-amplify/auth is imported'
    );

    try {
      await Auth.forgotPasswordSubmit(username, code, password);
      handleStateChange('signIn', null);
      setDelivery(null);
    } catch (error) {
      logger.error(error);
      showNotification({ content: error.message, variant: 'error' });
    }
  };

  const send = async (username: string): Promise<void> => {
    invariant(
      Auth && typeof Auth.forgotPassword === 'function',
      'No Auth module found, please ensure @aws-amplify/auth is imported'
    );

    try {
      const data = await Auth.forgotPassword(username);
      setDelivery(data.CodeDeliveryDetails);
    } catch (error) {
      logger.error(error);
      showNotification({ content: error.message, variant: 'error' });
    }
  };

  return {
    delivery,
    submit,
    send,
  };
};
