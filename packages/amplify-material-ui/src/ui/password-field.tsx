import * as React from 'react';
import { InputAdornment, IconButton, TextField } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import {
    StandardTextFieldProps,
    FilledTextFieldProps,
    OutlinedTextFieldProps,
} from '@material-ui/core/TextField';

export type PasswordFieldProps =
    | StandardTextFieldProps
    | FilledTextFieldProps
    | OutlinedTextFieldProps;

export const PasswordField: React.FC<PasswordFieldProps> = props => {
    const [showPassword, setShowPassword] = React.useState<boolean>(false);

    return (
        <TextField
            {...props}
            type={showPassword ? 'text' : 'password'}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="Toggle password visibility"
                            onClick={() =>
                                setShowPassword(showPassword => !showPassword)
                            }
                        >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
};
