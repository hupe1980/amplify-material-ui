import * as React from 'react';
import invariant from 'tiny-invariant';
import {
    Button,
    Grid,
    makeStyles,
    createStyles,
    Theme,
} from '@material-ui/core';
import Auth from '@aws-amplify/auth';
import { ConsoleLogger as Logger, I18n } from '@aws-amplify/core';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';

import { useAuthContext } from './auth-context';
import { useCheckContact } from './use-check-contact';
import { useUsernameField } from './use-username-field';
import { ChangeAuthStateLink } from './change-auth-state-link';
import { FormSection, SectionHeader, SectionBody, SectionFooter } from '../ui';

const logger = new Logger('SignIn');

export const useSignIn = (validationData?: {
    [key: string]: string;
}): ((username: string, password: string) => Promise<void>) => {
    const { onStateChange } = useAuthContext();

    const checkContact = useCheckContact();

    return async (username: string, password: string): Promise<void> => {
        invariant(
            Auth && typeof Auth.signIn === 'function',
            'No Auth module found, please ensure @aws-amplify/auth is imported',
        );

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
};

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

export interface SignInProps {
    validationData?: { [key: string]: string };
    hideSignUpLink?: boolean;
    hideForgotPasswordLink?: boolean;
}

export const SignIn: React.FC<SignInProps> = props => {
    const {
        validationData,
        hideSignUpLink = false,
        hideForgotPasswordLink = false,
    } = props;

    const classes = useStyles();
    const signIn = useSignIn(validationData);
    const { usernamefieldName, usernameField } = useUsernameField();

    return (
        <Formik<{ [fieldName: string]: string; password: string }>
            initialValues={{
                [usernamefieldName]: '',
                password: '',
            }}
            onSubmit={async (values, { setSubmitting }): Promise<void> => {
                await signIn(values[usernamefieldName], values['password']);
                setSubmitting(false);
            }}
        >
            {({ handleSubmit, isValid }): React.ReactNode => (
                <FormSection>
                    <SectionHeader>
                        {I18n.get('Sign in to your account')}
                    </SectionHeader>
                    <Form
                        className={classes.form}
                        onSubmit={handleSubmit}
                        data-testid="signInForm"
                        //noValidate
                    >
                        <SectionBody>
                            {usernameField}
                            <Field
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label={I18n.get('Password')}
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                component={TextField}
                            />
                        </SectionBody>
                        <SectionFooter>
                            <Button
                                type="submit"
                                disabled={!isValid}
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                data-testid="signInSubmit"
                            >
                                {I18n.get('Sign In')}
                            </Button>
                            <Grid container>
                                {!hideForgotPasswordLink && (
                                    <Grid item xs>
                                        <ChangeAuthStateLink
                                            label={I18n.get('Reset password')}
                                            newState="forgotPassword"
                                        />
                                    </Grid>
                                )}
                                {!hideSignUpLink && (
                                    <Grid item>
                                        <ChangeAuthStateLink
                                            label={I18n.get('Create account')}
                                            newState="signUp"
                                        />
                                    </Grid>
                                )}
                            </Grid>
                        </SectionFooter>
                    </Form>
                </FormSection>
            )}
        </Formik>
    );
};
