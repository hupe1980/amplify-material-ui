import * as React from 'react';
import { useIntl } from 'react-intl';
import { Field } from 'formik';
import { TextField } from 'formik-material-ui';

import { PhoneField } from '../ui';
import { UsernameAttribute } from './types';

export const useUsernameField = (
  usernameAttribute?: UsernameAttribute
): { usernamefieldName: string; usernameField: React.ReactElement } => {
  const { formatMessage } = useIntl();

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
            label={formatMessage({
              id: 'global.labels.email',
              defaultMessage: 'Email',
            })}
            name="email"
            autoFocus
            component={TextField}
          />
        ),
      };

    case UsernameAttribute.PHONE_NUMBER:
      return {
        usernamefieldName: 'phone',
        usernameField: (
          <PhoneField
            required
            label={formatMessage({
              id: 'global.labels.phoneNumber',
              defaultMessage: 'Phone Number',
            })}
          />
        ),
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
            label={formatMessage({
              id: 'global.labels.username',
              defaultMessage: 'Username',
            })}
            name="username"
            autoFocus
            component={TextField}
          />
        ),
      };
  }
};
