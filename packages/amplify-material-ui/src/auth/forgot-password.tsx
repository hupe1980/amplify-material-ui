import * as React from 'react';
import invariant from 'tiny-invariant';
import {
    createStyles,
    makeStyles,
    Button,
    Theme,
    Grid,
    Link,
} from '@material-ui/core';
import Auth from '@aws-amplify/auth';
import { I18n } from '@aws-amplify/core';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';

import { useAuthContext } from './auth-context';
import { FormSection, SectionHeader, SectionBody, SectionFooter } from '../ui';

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

export const ForgotPassword: React.FC = () => {
    const { onStateChange, authData } = useAuthContext();

    const classes = useStyles();

    const submit = async (code: string, password: string): Promise<void> => {
        invariant(
            Auth && typeof Auth.forgotPasswordSubmit === 'function',
            'No Auth module found, please ensure @aws-amplify/auth is imported',
        );

        const { username } = authData;

        try {
            await Auth.forgotPasswordSubmit(username, code, password);
            onStateChange('signIn', null);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Formik<{ code: string; password: string }>
            initialValues={{
                code: '',
                password: '',
            }}
            onSubmit={async (
                { code, password },
                { setSubmitting },
            ): Promise<void> => {
                await submit(code, password);
                setSubmitting(false);
            }}
        >
            {({ submitForm, isValid }): React.ReactNode => (
                <FormSection>
                    <SectionHeader>
                        {I18n.get('Reset your password')}
                    </SectionHeader>
                    <Form className={classes.form}>
                        <SectionBody>
                            <Field
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="code"
                                label={I18n.get('Code')}
                                name="code"
                                autoFocus
                                component={TextField}
                            />
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
                                {I18n.get('Submit')}
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link
                                        href="#"
                                        onClick={(): void =>
                                            console.log('Resend code')
                                        }
                                        variant="body2"
                                    >
                                        {I18n.get('Resend Code')}
                                    </Link>
                                </Grid>
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
