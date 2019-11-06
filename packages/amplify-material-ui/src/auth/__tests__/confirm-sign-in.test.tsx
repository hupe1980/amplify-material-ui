import * as React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { render } from '@testing-library/react';
import { ConfirmSignIn, useMfaType } from '../confirm-sign-in';
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

describe('use-mfa-type', () => {
    it('should return SMS', () => {
        const user = {
            challengeName: 'XXX',
        };

        const { result } = renderHook(() => useMfaType(user));

        expect(result.current).toBe('SMS');
    });

    it('should return TOTP is challengeName = SOFTWARE_TOKEN_MFA', () => {
        const user = {
            challengeName: 'SOFTWARE_TOKEN_MFA',
        };

        const { result } = renderHook(() => useMfaType(user));

        expect(result.current).toBe('TOTP');
    });
});
