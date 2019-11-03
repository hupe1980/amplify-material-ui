import * as React from 'react';
import invariant from 'tiny-invariant';
import {
    Button,
    Grid,
    Link,
    makeStyles,
    createStyles,
    Theme,
} from '@material-ui/core';
import Auth from '@aws-amplify/auth';
import { I18n, JS } from '@aws-amplify/core';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';

import { useAuthContext } from './auth-context';
import { FormSection, SectionHeader, SectionBody, SectionFooter } from '../ui';
import { useMfaType } from './use-mfa-type';

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

export const ConfirmSignIn: React.FC = () => {
    const { onStateChange, authData: user } = useAuthContext();

    const classes = useStyles();

    const mfaType = useMfaType(user);

    const checkContact = async (user: any): Promise<void> => {
        invariant(
            Auth && typeof Auth.verifiedContact === 'function',
            'No Auth module found, please ensure @aws-amplify/auth is imported',
        );

        const data = await Auth.verifiedContact(user);

        if (!JS.isEmpty(data.verified)) {
            onStateChange('signedIn', user);
        } else {
            const newUser = Object.assign(user, data);
            onStateChange('verifyContact', newUser);
        }
    };

    const confirm = async (code: string): Promise<void> => {
        invariant(
            Auth && typeof Auth.confirmSignIn === 'function',
            'No Auth module found, please ensure @aws-amplify/auth is imported',
        );

        try {
            await Auth.confirmSignIn(
                user,
                code,
                mfaType === 'TOTP' ? 'SOFTWARE_TOKEN_MFA' : null,
            );
            checkContact(user);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Formik<{ code: string }>
            initialValues={{
                code: '',
            }}
            onSubmit={async ({ code }, { setSubmitting }): Promise<void> => {
                await confirm(code);
                setSubmitting(false);
            }}
        >
            {({ submitForm, isValid }): React.ReactNode => (
                <FormSection>
                    <SectionHeader>
                        {I18n.get('Confirm ' + mfaType + ' Code')}
                    </SectionHeader>
                    <Form className={classes.form}>
                        <SectionBody>
                            <Field
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="code"
                                label={`${I18n.get('Code')} *`}
                                name="code"
                                autoComplete="code"
                                autoFocus
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
                                {I18n.get('Confirm')}
                            </Button>
                            <Grid container>
                                <Grid item xs>
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
