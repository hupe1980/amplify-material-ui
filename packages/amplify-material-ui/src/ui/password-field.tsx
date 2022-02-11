import * as React from 'react';
import {
  InputAdornment,
  IconButton,
  TextField,
  StandardTextFieldProps,
  FilledTextFieldProps,
  OutlinedTextFieldProps,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

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
              size="large">
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
