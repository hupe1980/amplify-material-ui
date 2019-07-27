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
import { ConsoleLogger as Logger, I18n, JS } from '@aws-amplify/core';

import { AuthProps } from './auth-props';
import { FormSection, SectionHeader, SectionBody, SectionFooter } from '../ui';
import { useForm } from '../hooks';

const logger = new Logger('SignIn');

export interface SignInProps extends AuthProps {
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

export const SignIn: React.FC<SignInProps> = props => {
    const { authState, onStateChange, validationData } = props;
    const classes = useStyles();

    const checkContact = async (user: any) => {
        if (!Auth || typeof Auth.verifiedContact !== 'function') {
            throw new Error(
                'No Auth module found, please ensure @aws-amplify/auth is imported',
            );
        }
        const data = await Auth.verifiedContact(user);
        if (!JS.isEmpty(data.verified)) {
            onStateChange('signedIn', user);
        } else {
            user = Object.assign(user, data);
            onStateChange('verifyContact', user);
        }
    };

    const signIn = async (inputs: any) => {
        if (!Auth || typeof Auth.signIn !== 'function') {
            throw new Error(
                'No Auth module found, please ensure @aws-amplify/auth is imported',
            );
        }

        const { username, password } = inputs;

        try {
            const user = await Auth.signIn({
                username,
                password,
                validationData,
            });
            logger.debug(user);
            if (
                user.challengeName === 'SMS_MFA' ||
                user.challengeName === 'SOFTWARE_TOKEN_MFA'
            ) {
                logger.debug('confirm user with ' + user.challengeName);
                onStateChange('confirmSignIn', user);
            } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                logger.debug('require new password', user.challengeParam);
                onStateChange('requireNewPassword', user);
            } else if (user.challengeName === 'MFA_SETUP') {
                logger.debug('TOTP setup', user.challengeParam);
                onStateChange('TOTPSetup', user);
            } else {
                checkContact(user);
            }
        } catch (err) {
            if (err.code === 'UserNotConfirmedException') {
                logger.debug('the user is not confirmed');
                onStateChange('confirmSignUp', { username });
            } else if (err.code === 'PasswordResetRequiredException') {
                logger.debug('the user requires a new password');
                onStateChange('forgotPassword', { username });
            } else {
                //this.error(err);
                console.log(err);
            }
        } finally {
            //this.setState({ loading: false });
        }
        //onStateChange('signedIn', null); //TODO
    };

    const { inputs, handleInputChange, handleSubmit } = useForm(signIn, {
        username: '',
        password: '',
        token: '',
    });

    if (!['signIn', 'signedOut', 'signedUp'].includes(authState)) {
        return null;
    }

    return (
        <FormSection>
            <SectionHeader>{I18n.get('Sign in to your account')}</SectionHeader>
            <form
                onSubmit={handleSubmit}
                className={classes.form}
                noValidate
                data-testid="signInForm"
            >
                <SectionBody>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoFocus
                        onChange={handleInputChange}
                        value={inputs.username}
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
                        data-testid="signInSubmit"
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
