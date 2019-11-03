import { renderHook } from '@testing-library/react-hooks';

import { useMfaType } from '../use-mfa-type';

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
