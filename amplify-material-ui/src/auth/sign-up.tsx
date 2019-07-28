import * as React from 'react';
import {
    Button,
    Grid,
    Link,
    TextField,
    makeStyles,
    createStyles,
    Theme,
} from '@material-ui/core';
import Auth from '@aws-amplify/auth';
import { I18n } from '@aws-amplify/core';

import { FormSection, SectionHeader, SectionBody, SectionFooter } from '../ui';
import { useForm } from '../hooks';

import { AuthComponent, AuthProps } from './types';

export interface SignUpProps extends AuthProps {
    validationData?: { [key: string]: string };
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        form: {
            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(1),
        },
        submit: {
            margin: theme.spacing(3, 0, 2),
        },
    }),
);

export const SignUp: AuthComponent<SignUpProps> = props => {
    const { onStateChange } = props;
    const classes = useStyles();

    const signUp = async (inputs: any) => {
        if (!Auth || typeof Auth.signUp !== 'function') {
            throw new Error(
                'No Auth module found, please ensure @aws-amplify/auth is imported',
            );
        }
    };

    const { inputs, handleInputChange, handleSubmit } = useForm(signUp, {
        email: '',
        password: '',
    });

    return (
        <FormSection>
            <SectionHeader>{I18n.get('Sign in to your account')}</SectionHeader>
            <form onSubmit={handleSubmit} className={classes.form} noValidate>
                <SectionBody>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={handleInputChange}
                        value={inputs.email}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={handleInputChange}
                        value={inputs.password}
                    />
                </SectionBody>
                <SectionFooter>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign Up
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            Have an account?
                            <Link
                                href="#"
                                onClick={() => onStateChange('signIn', null)}
                                variant="body2"
                            >
                                Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </SectionFooter>
            </form>
        </FormSection>
    );
};

SignUp.validAuthStates = ['signUp'];
