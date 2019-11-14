import * as React from 'react';
import invariant from 'tiny-invariant';
import {
    createStyles,
    Button,
    makeStyles,
    Theme,
    Grid,
} from '@material-ui/core';
import Auth from '@aws-amplify/auth';
import { ConsoleLogger as Logger, I18n } from '@aws-amplify/core';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';

import { useAuthContext } from './auth-context';
import { useCheckContact } from './use-check-contact';
import { ChangeAuthStateLink } from './change-auth-state-link';
import { FormSection, SectionHeader, SectionBody, SectionFooter } from '../ui';

const logger = new Logger('RequireNewPassword');

export const useCompleteNewPassword = (): ((
    password: string,
) => Promise<void>) => {
    const { authData: user, onStateChange } = useAuthContext();

    const checkContact = useCheckContact();

    return async (password: string): Promise<void> => {
        //const { requiredAttributes } = user.challengeParam;
        //const attrs = objectWithProperties(this.inputs, requiredAttributes);
        invariant(
            Auth && typeof Auth.completeNewPassword === 'function',
            'No Auth module found, please ensure @aws-amplify/auth is imported',
        );

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

export const RequireNewPassword: React.FC = () => {
    const classes = useStyles();

    const completeNewPassword = useCompleteNewPassword();

    return (
        <Formik<{ password: string }>
            initialValues={{
                password: '',
            }}
            onSubmit={async (
                { password },
                { setSubmitting },
            ): Promise<void> => {
                await completeNewPassword(password);
                setSubmitting(false);
            }}
        >
            {({ handleSubmit, isValid }): React.ReactNode => (
                <FormSection>
                    <SectionHeader>{I18n.get('Change Password')}</SectionHeader>
                    <Form className={classes.form} onSubmit={handleSubmit}>
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
                                type="submit"
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
                                    <ChangeAuthStateLink
                                        label={I18n.get('Back to Sign In')}
                                        newState="signIn"
                                    />
                                </Grid>
                            </Grid>
                        </SectionFooter>
                    </Form>
                </FormSection>
            )}
        </Formik>
    );
};
