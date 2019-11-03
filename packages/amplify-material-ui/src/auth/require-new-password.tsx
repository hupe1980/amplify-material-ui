import * as React from 'react';
import invariant from 'tiny-invariant';
import {
    createStyles,
    Button,
    makeStyles,
    Theme,
    Grid,
    Link,
} from '@material-ui/core';
import Auth from '@aws-amplify/auth';
import { ConsoleLogger as Logger, I18n, JS } from '@aws-amplify/core';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';

import { useAuthContext } from './auth-context';
import { FormSection, SectionHeader, SectionBody, SectionFooter } from '../ui';

const logger = new Logger('RequireNewPassword');

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

export const RequireNewPassword: React.FC = () => {
    const { authData: user, onStateChange } = useAuthContext();

    const classes = useStyles();

    const checkContact = async (user: any): Promise<void> => {
        invariant(
            Auth && typeof Auth.verifiedContact === 'function',
            'No Auth module found, please ensure @aws-amplify/auth is imported',
        );

        const data = await Auth.verifiedContact(user);

        if (!JS.isEmpty(data.verified)) {
            onStateChange('signedIn', user);
        } else {
            user = Object.assign(user, data);
            onStateChange('verifyContact', user);
        }
    };

    const submit = async (password: string): Promise<void> => {
        //const { requiredAttributes } = user.challengeParam;
        //const attrs = objectWithProperties(this.inputs, requiredAttributes);

        if (!Auth || typeof Auth.completeNewPassword !== 'function') {
            throw new Error(
                'No Auth module found, please ensure @aws-amplify/auth is imported',
            );
        }
        try {
            const updatedUser = await Auth.completeNewPassword(
                user,
                password,
                undefined,
            );

            logger.debug('complete new password', updatedUser);

            if (updatedUser.challengeName === 'SMS_MFA') {
                onStateChange('confirmSignIn', updatedUser);
            } else if (updatedUser.challengeName === 'MFA_SETUP') {
                logger.debug('TOTP setup', updatedUser.challengeParam);
                onStateChange('TOTPSetup', updatedUser);
            } else {
                checkContact(updatedUser);
            }
        } catch (error) {
            console.log(error); /*this.error(err)*/
        }
    };

    return (
        <Formik<{ password: string }>
            initialValues={{
                password: '',
            }}
            onSubmit={async (
                { password },
                { setSubmitting },
            ): Promise<void> => {
                await submit(password);
                setSubmitting(false);
            }}
        >
            {({ submitForm, isValid }): React.ReactNode => (
                <FormSection>
                    <SectionHeader>{I18n.get('Change Password')}</SectionHeader>
                    <Form className={classes.form}>
                        <SectionBody>
                            <Field
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label={I18n.get('New Password')}
                                type="password"
                                id="password"
                                component={TextField}
                            />
                        </SectionBody>
                        <SectionFooter>
                            <Button
                                onClick={submitForm}
                                disabled={!isValid}
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                {I18n.get('Change')}
                            </Button>
                            <Grid container>
                                <Grid item>
                                    <Link
                                        href="#"
                                        onClick={(): void =>
                                            onStateChange('signIn', null)
                                        }
                                        variant="body2"
                                    >
                                        {I18n.get('Back to Sign In')}
                                    </Link>
                                </Grid>
                            </Grid>
                        </SectionFooter>
                    </Form>
                </FormSection>
            )}
        </Formik>
    );
};
