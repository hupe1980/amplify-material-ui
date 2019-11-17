import * as React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import invariant from 'tiny-invariant';
import {
    Button,
    Grid,
    makeStyles,
    createStyles,
    Theme,
} from '@material-ui/core';
import Auth from '@aws-amplify/auth';
import { ConsoleLogger as Logger } from '@aws-amplify/core';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';

import { FormSection, SectionHeader, SectionBody, SectionFooter } from '../ui';
import { useAuthContext } from './auth-context';
import { useNotificationContext } from './notification-context';
import { useCheckContact } from './use-check-contact';
import { useUsernameField } from './use-username-field';
import { ChangeAuthStateLink } from './change-auth-state-link';
import { UsernameAttribute } from './types';

const logger = new Logger('SignIn');

export const useSignIn = (): ((
    username: string,
    password: string,
    validationData?: Record<string, string>,
) => Promise<void>) => {
    const { handleStateChange } = useAuthContext();
    const { showNotification } = useNotificationContext();

    const checkContact = useCheckContact();

    return async (
        username: string,
        password: string,
        validationData?: {
            [key: string]: string;
        },
    ): Promise<void> => {
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
                handleStateChange('confirmSignIn', user);
            } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                logger.debug('require new password', user.challengeParam);
                handleStateChange('requireNewPassword', user);
            } else if (user.challengeName === 'MFA_SETUP') {
                logger.debug('TOTP setup', user.challengeParam);
                handleStateChange('TOTPSetup', user);
            } else {
                checkContact(user);
            }
        } catch (err) {
            if (err.code === 'UserNotConfirmedException') {
                logger.debug('the user is not confirmed');
                handleStateChange('confirmSignUp', { username });
            } else if (err.code === 'PasswordResetRequiredException') {
                logger.debug('the user requires a new password');
                handleStateChange('forgotPassword', { username });
            } else {
                logger.error(err);
                showNotification({
                    content: err.message,
                    variant: 'error',
                });
            }
        }
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
    usernameAttribute?: UsernameAttribute;
}

export const SignIn: React.FC<SignInProps> = props => {
    const {
        validationData,
        hideSignUpLink = false,
        hideForgotPasswordLink = false,
        usernameAttribute,
    } = props;

    const classes = useStyles();
    const { formatMessage } = useIntl();
    const signIn = useSignIn();
    const { usernamefieldName, usernameField } = useUsernameField(
        usernameAttribute,
    );

    return (
        <Formik<{ [fieldName: string]: string; password: string }>
            initialValues={{
                [usernamefieldName]: '',
                password: '',
            }}
            onSubmit={async (values, { setSubmitting }): Promise<void> => {
                await signIn(
                    values[usernamefieldName],
                    values['password'],
                    validationData,
                );
                setSubmitting(false);
            }}
        >
            {({ handleSubmit, isValid }): React.ReactNode => (
                <FormSection>
                    <SectionHeader>
                        <FormattedMessage
                            id="signIn.header"
                            defaultMessage="Sign in to your account"
                        />
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
                                label={formatMessage({
                                    id: 'global.labels.password',
                                    defaultMessage: 'Password',
                                })}
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
                                <FormattedMessage
                                    id="signIn.buttons.signIn"
                                    defaultMessage="Sign In"
                                />
                            </Button>
                            <Grid container>
                                {!hideForgotPasswordLink && (
                                    <Grid item xs>
                                        <ChangeAuthStateLink
                                            label={formatMessage({
                                                id:
                                                    'signIn.links.forgotPassword',
                                                defaultMessage:
                                                    'Reset password',
                                            })}
                                            newState="forgotPassword"
                                            data-testid="forgot-password-link"
                                        />
                                    </Grid>
                                )}
                                {!hideSignUpLink && (
                                    <Grid item>
                                        <ChangeAuthStateLink
                                            label={formatMessage({
                                                id: 'signIn.links.signUp',
                                                defaultMessage:
                                                    'Create account',
                                            })}
                                            newState="signUp"
                                            data-testid="sign-up-link"
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
