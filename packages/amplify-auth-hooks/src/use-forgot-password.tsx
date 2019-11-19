import * as React from 'react';
import invariant from 'tiny-invariant';
import Auth from '@aws-amplify/auth';
import { ConsoleLogger as Logger } from '@aws-amplify/core';

import { useAuthContext } from './use-auth-context';

const logger = new Logger('useForgotPassword');

export const useForgotPassword = () => {
  invariant(
    (Auth && typeof Auth.forgotPassword === 'function') ||
      typeof Auth.forgotPasswordSubmit === 'function',
    'No Auth module found, please ensure @aws-amplify/auth is imported'
  );

  const [delivery, setDelivery] = React.useState(null);
  const { handleStateChange } = useAuthContext();

  const submit = async (
    code: string,
    username: string,
    password: string
  ): Promise<void> => {
    try {
      await Auth.forgotPasswordSubmit(username, code, password);
      handleStateChange('signIn', null);
      setDelivery(null);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  };

  const send = async (username: string): Promise<void> => {
    try {
      const data = await Auth.forgotPassword(username);
      setDelivery(data.CodeDeliveryDetails);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  };

  return {
    delivery,
    submit,
    send,
  };
};
