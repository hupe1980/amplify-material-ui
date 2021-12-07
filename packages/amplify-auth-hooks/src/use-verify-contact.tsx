import * as React from 'react';
import invariant from 'tiny-invariant';
import Auth from '@aws-amplify/auth';
import { ConsoleLogger as Logger } from '@aws-amplify/core';

import { useAuthContext } from './use-auth-context';

const logger = new Logger('useVerifyContact');

export const useVerifyContact = () => {
  invariant(
    (Auth && typeof Auth.verifyCurrentUserAttribute === 'function') ||
      typeof Auth.verifyCurrentUserAttributeSubmit === 'function',
    'No Auth module found, please ensure @aws-amplify/auth is imported',
  );

  const { handleStateChange, authData } = useAuthContext();
  const [verifyAttr, setVerifyAttr] = React.useState<string | null>(null);

  const verify = async (contact: string): Promise<void> => {
    try {
      const data = await Auth.verifyCurrentUserAttribute(contact);
      logger.debug(data);
      setVerifyAttr(contact);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  };

  const submit = async (code: string): Promise<void> => {
    if (!verifyAttr) {
      return;
    }

    try {
      await Auth.verifyCurrentUserAttributeSubmit(verifyAttr, code);
      handleStateChange('signedIn', authData);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  };

  return {
    verifyAttr,
    verify,
    submit,
  };
};
