import * as React from 'react';

export const useMfaType = (user: { challengeName: string }): string => {
    const [mfaType, setMfaType] = React.useState('SMS');

    React.useEffect(() => {
        const newMfaType =
            user && user.challengeName === 'SOFTWARE_TOKEN_MFA'
                ? 'TOTP'
                : 'SMS';
        if (mfaType !== newMfaType) {
            setMfaType(newMfaType);
        }
    }, [mfaType, user]);

    return mfaType;
};
