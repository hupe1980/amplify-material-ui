import * as React from 'react';
import {
  InputAdornment,
  IconButton,
  TextField,
  StandardTextFieldProps,
  FilledTextFieldProps,
  OutlinedTextFieldProps,
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

export type PasswordFieldProps = StandardTextFieldProps | FilledTextFieldProps | OutlinedTextFieldProps;

export const PasswordField: React.FC<PasswordFieldProps> = (props) => {
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  return (
    <TextField
      {...props}
      type={showPassword ? 'text' : 'password'}
      inputProps={{ 'data-testid': 'password-input' }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="Toggle password visibility"
              data-testid="togglePasswordVisibility"
              onClick={(): void => setShowPassword((showPassword) => !showPassword)}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
