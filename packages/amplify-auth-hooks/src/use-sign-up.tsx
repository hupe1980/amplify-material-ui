import invariant from 'tiny-invariant';
import Auth from '@aws-amplify/auth';
import { ConsoleLogger as Logger } from '@aws-amplify/core';

import { useAuthContext } from './use-auth-context';
import { useNotificationContext } from './use-notification-context';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';

const logger = new Logger('useSignUp');

export const useSignUp = (): ((
  username: string,
  password: string,
  validationData?: Record<string, string>
) => Promise<void>) => {
  const { handleStateChange } = useAuthContext();
  const { showNotification } = useNotificationContext();

  return async (
    email: string,
    password: string,
    validationData?: {
      [key: string]: string;
    }
  ): Promise<void> => {
    invariant(
      Auth && typeof Auth.signUp === 'function',
      'No Auth module found, please ensure @aws-amplify/auth is imported'
    );

    const validationDataArray: CognitoUserAttribute[] = [];
    if (validationData) {
      for (const [name, value] of Object.entries(validationData)) {
        validationDataArray.push(
          new CognitoUserAttribute({
            Name: name,
            Value: value,
          })
        );
      }
    }

    const signupInfo = {
      username: email,
      password: password,
      attributes: {},
      validationData: validationDataArray,
    };

    try {
      const data = await Auth.signUp(signupInfo);
      handleStateChange('confirmSignUp', data.user.getUsername());
    } catch (error) {
      logger.error(error);
      showNotification({
        content: error.message,
        variant: 'error',
      });
    }
  };
};
