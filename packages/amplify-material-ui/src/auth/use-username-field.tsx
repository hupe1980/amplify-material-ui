import * as React from 'react';
import { Field } from 'formik';
import { TextField } from 'formik-material-ui';

import { PhoneField } from '../ui';

export enum UsernameAttribute {
    EMAIL = 'email',
    PHONE_NUMBER = 'phone_number',
    USERNAME = 'username',
}

export const useUsernameField = (
    usernameAttribute?: UsernameAttribute,
): { usernamefieldName: string; usernameField: React.ReactElement } => {
    switch (usernameAttribute) {
        case UsernameAttribute.EMAIL:
            return {
                usernamefieldName: 'email',
                usernameField: (
                    <Field
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="EMail"
                        name="email"
                        autoFocus
                        component={TextField}
                    />
                ),
            };

        case UsernameAttribute.PHONE_NUMBER:
            return {
                usernamefieldName: 'phone',
                usernameField: <PhoneField required label="Phone Number" />,
            };

        default:
            return {
                usernamefieldName: 'username',
                usernameField: (
                    <Field
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoFocus
                        component={TextField}
                    />
                ),
            };
    }
};
