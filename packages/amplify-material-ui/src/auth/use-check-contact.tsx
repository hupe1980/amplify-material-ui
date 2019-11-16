import invariant from 'tiny-invariant';
import Auth from '@aws-amplify/auth';
import { JS } from '@aws-amplify/core';

import { useAuthContext } from './auth-context';

export const useCheckContact = () => {
    const { handleStateChange } = useAuthContext();

    return async (user: any): Promise<void> => {
        invariant(
            Auth && typeof Auth.verifiedContact === 'function',
            'No Auth module found, please ensure @aws-amplify/auth is imported',
        );

        const data = await Auth.verifiedContact(user);

        if (!JS.isEmpty(data.verified)) {
            handleStateChange('signedIn', user);
        } else {
            const newUser = Object.assign(user, data);
            handleStateChange('verifyContact', newUser);
        }
    };
};
