import invariant from 'tiny-invariant';
import Auth from '@aws-amplify/auth';
import { ConsoleLogger as Logger } from '@aws-amplify/core';
import useScript from 'react-script-hook';

import { useAuthContext } from './use-auth-context';

const logger = new Logger('useAmazonFederation');

export interface AmazonFederationProps {
  clientId: string;
  scriptSrc?: string;
}

interface UserInfo {
  success: boolean;
  profile: Record<string, string>;
}

interface AuthorizeResponse {
  access_token?: string;
  expires_in: number;
  error?: Error;
}

export const useAmazonFederation = (props: AmazonFederationProps) => {
  invariant(
    Auth && typeof Auth.federatedSignIn === 'function' && typeof Auth.currentAuthenticatedUser === 'function',
    'No Auth module found, please ensure @aws-amplify/auth is imported',
  );

  const { clientId, scriptSrc = 'https://api-cdn.amazon.com/sdk/login1.js' } = props;

  const { handleStateChange } = useAuthContext();

  const [loading, error] = useScript({
    src: scriptSrc,
    onload: () => {
      logger.debug('init amazon');
      const amz = (window as any).amazon;
      amz.Login.setClientId(clientId);
    },
  });

  const federatedSignIn = (response: AuthorizeResponse) => {
    const { access_token: accessToken, expires_in: expiresIn } = response;

    if (!accessToken) {
      return;
    }

    const expiresAt = expiresIn * 1000 + Date.now();

    const amz = (window as any).amazon;

    amz.Login.retrieveProfile(async (userInfo: UserInfo) => {
      if (!userInfo.success) {
        logger.debug('Get user Info failed');
        return;
      }

      const user = {
        name: userInfo.profile.Name,
        email: userInfo.profile.PrimaryEmail,
      };

      await Auth.federatedSignIn('amazon', { token: accessToken, expires_at: expiresAt }, user);
      const authUser = await Auth.currentAuthenticatedUser();

      handleStateChange('signedIn', authUser);
    });
  };

  const signIn = () => {
    const amz = (window as any).amazon;
    const options = { scope: 'profile' };

    amz.Login.authorize(options, async (response: AuthorizeResponse) => {
      if (response.error) {
        logger.debug('Failed to login with amazon: ' + response.error);
        return;
      }

      federatedSignIn(response);
    });
  };

  const signOut = () => {
    const amz = (window as any).amazon;

    if (!amz) {
      logger.debug('Amazon Login sdk undefined');
      return;
    }

    logger.debug('Amazon signing out');
    amz.Login.logout();
  };

  return {
    loading,
    error,
    signIn,
    signOut,
  };
};
