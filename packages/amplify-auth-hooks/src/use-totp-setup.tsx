import { useState, useEffect } from 'react';
import invariant from 'tiny-invariant';
import Auth from '@aws-amplify/auth';
import { ConsoleLogger as Logger } from '@aws-amplify/core';

import { useAuthContext } from './use-auth-context';

const logger = new Logger('useTOTPSetup');

export const useTOTPSetup = () => {
  invariant(
    Auth &&
      typeof Auth.setupTOTP === 'function' &&
      typeof Auth.verifyTotpToken === 'function' &&
      typeof Auth.setPreferredMFA === 'function',
    'No Auth module found, please ensure @aws-amplify/auth is imported',
  );

  const [code, setCode] = useState<string | null>(null);

  const { authData } = useAuthContext();

  const verifyTotpToken = async (totpCode: string) => {
    try {
      await Auth.verifyTotpToken(authData, totpCode);
      Auth.setPreferredMFA(authData, 'TOTP');
    } catch (error) {
      logger.error(error);
      throw error;
    }
  };

  useEffect(() => {
    const setup = async (): Promise<void> => {
      const data = await Auth.setupTOTP(authData);
      logger.debug('secret key', data);

      setCode(`otpauth://totp/AWSCognito:${authData.username}?secret=${data}&issuer=AWSCognito`);
    };
    setup();
  }, [authData]);

  return { code, verifyTotpToken };
};
