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

import AuthProps from './auth-props';
import { FormSection, SectionHeader, SectionBody, SectionFooter } from '../ui';
import { useForm } from '../hooks';

export interface SignInProps extends AuthProps {
    validationData?: { [key: string]: string };
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        form: {
            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(1),
            padding: theme.spacing(1),
        },
        submit: {
            margin: theme.spacing(3, 0, 2),
        },
    }),
);

const SignIn: React.FC<SignInProps> = props => {
    const { authState, onStateChange } = props;
    const classes = useStyles();

    const signIn = async (inputs: any) => {
        if (!Auth || typeof Auth.signIn !== 'function') {
            throw new Error(
                'No Auth module found, please ensure @aws-amplify/auth is imported',
            );
        }
        onStateChange('signedIn', null); //TODO
    };

    const { inputs, handleInputChange, handleSubmit } = useForm(signIn, {
        email: '',
        password: '',
    });

    if (!['signIn', 'signedOut', 'signedUp'].includes(authState)) {
        return null;
    }

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
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link
                                href="#"
                                onClick={() =>
                                    onStateChange('forgotPassword', null)
                                }
                                variant="body2"
                            >
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link
                                href="#"
                                onClick={() => onStateChange('signUp', null)}
                                variant="body2"
                            >
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </SectionFooter>
            </form>
        </FormSection>
    );
};

export default SignIn;
