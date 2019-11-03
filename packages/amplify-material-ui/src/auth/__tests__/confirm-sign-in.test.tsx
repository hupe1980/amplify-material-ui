import * as React from 'react';
import { render } from '@testing-library/react';
import { ConfirmSignIn } from '../confirm-sign-in';
import { AuthContext } from '../auth-context';

describe('confirm-sign-in', () => {
    const handleStateChange = jest.fn();

    const withContext = component => (
        <AuthContext.Provider
            value={{
                authState: 'confirmSignIn',
                authData: { challengeName: 'SOFTWARE_TOKEN_MFA' },
                onStateChange: handleStateChange,
            }}
        >
            {component}
        </AuthContext.Provider>
    );

    it('should be rendered correctly in the confirmSignIn authState', () => {
        const { asFragment } = render(withContext(<ConfirmSignIn />));
        expect(asFragment()).toMatchSnapshot();
    });
});
