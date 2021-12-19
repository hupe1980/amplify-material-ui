import invariant from 'tiny-invariant';
import Auth from '@aws-amplify/auth';

export const useSignOut = (global = false): ((global?: boolean) => Promise<void>) => {
  invariant(
    Auth && typeof Auth.signOut === 'function',
    'No Auth module found, please ensure @aws-amplify/auth is imported',
  );

  return async (): Promise<void> => Auth.signOut({ global });
};
