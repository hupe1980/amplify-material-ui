import invariant from 'tiny-invariant';
import Auth from '@aws-amplify/auth';
import { ConsoleLogger as Logger } from '@aws-amplify/core';
import useScript from 'react-script-hook';

import { useAuthContext } from './use-auth-context';

const logger = new Logger('useAmazonFederation');

export interface GoogleFederationProps {
  clientId: string;
  scriptSrc?: string;
}

export const useGoogleFederation = (props: GoogleFederationProps) => {
  invariant(
    Auth && typeof Auth.federatedSignIn === 'function' && typeof Auth.currentAuthenticatedUser === 'function',
    'No Auth module found, please ensure @aws-amplify/auth is imported',
  );

  const { clientId, scriptSrc = 'https://apis.google.com/js/platform.js' } = props;

  const { handleStateChange } = useAuthContext();

  const [loading, error] = useScript({
    src: scriptSrc,
    onload: () => {
      logger.debug('init gapi');

      const g = (window as any).gapi;

      g.load('auth2', () => {
        g.auth2.init({
          client_id: clientId,
          scope: 'profile email openid',
        });
      });
    },
  });

  const federatedSignIn = async (googleUser: gapi.auth2.GoogleUser) => {
    const { id_token: idToken, expires_at: expiresAt } = googleUser.getAuthResponse();

    const profile = googleUser.getBasicProfile();

    const user = {
      email: profile.getEmail(),
      name: profile.getName(),
      picture: profile.getImageUrl(),
    };

    await Auth.federatedSignIn('google', { token: idToken, expires_at: expiresAt }, user);

    const authUser = await Auth.currentAuthenticatedUser();

    handleStateChange('signedIn', authUser);
  };

  const signIn = async () => {
    const ga = (window as any).gapi.auth2.getAuthInstance();

    const googleUser = await ga.signIn();

    return federatedSignIn(googleUser);
  };

  const signOut = async () => {
    const googleAuth =
      (window as any).gapi && (window as any).gapi.auth2 ? (window as any).gapi.auth2.getAuthInstance() : null;

    if (!googleAuth) {
      logger.debug('google Auth undefined');
      return Promise.resolve();
    }

    logger.debug('google signing out');
    await googleAuth.signOut();
  };

  return {
    loading,
    error,
    signIn,
    signOut,
  };
};
