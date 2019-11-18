import * as React from 'react';
import invariant from 'tiny-invariant';
import Auth from '@aws-amplify/auth';
import { ConsoleLogger as Logger } from '@aws-amplify/core';

import { useAuthContext } from './use-auth-context';
//import { useCheckContact } from './use-check-contact';

const logger = new Logger('useTOTPSetup');

export const useTOTPSetup = () => {
  const [code, setCode] = React.useState<string | null>(null);
  const { authData } = useAuthContext();
  //const checkContact = useCheckContact();

  // const handleTOTPEvent = (event, data, user) => {
  //     logger.debug('handleTOTPEvent', event, data);
  //     // const user = this.props.authData;
  //     if (event === 'Setup TOTP') {
  //         if (data === 'SUCCESS') {
  //             checkContact(user);
  //         }
  //     }
  // };

  React.useEffect(() => {
    const setup = async (): Promise<void> => {
      invariant(
        Auth && typeof Auth.setupTOTP === 'function',
        'No Auth module found, please ensure @aws-amplify/auth is imported'
      );
      const data = await Auth.setupTOTP(authData);
      logger.debug('secret key', data);

      setCode(`otpauth://totp/`);
    };
    setup();
  });

  return { code };
};
