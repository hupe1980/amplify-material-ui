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
import { useNotificationContext } from './notification-context';
import { useUsernameField } from './use-username-field';
import { ChangeAuthStateLink } from './change-auth-state-link';
import { FormSection, SectionHeader, SectionBody, SectionFooter } from '../ui';

export const useForgotPassword = () => {
    const [delivery, setDelivery] = React.useState(null);
    const { handleStateChange } = useAuthContext();
    const { showNotification } = useNotificationContext();

    const submit = async (
        code: string,
        username: string,
        password: string,
    ): Promise<void> => {
        invariant(
            Auth && typeof Auth.forgotPasswordSubmit === 'function',
            'No Auth module found, please ensure @aws-amplify/auth is imported',
        );

        try {
            await Auth.forgotPasswordSubmit(username, code, password);
            handleStateChange('signIn', null);
            setDelivery(null);
        } catch (error) {
            console.log(error);
            showNotification({ content: 'ERRRO', variant: 'error' });
        }
    };

    const send = async (username: string): Promise<void> => {
        invariant(
            Auth && typeof Auth.forgotPassword === 'function',
            'No Auth module found, please ensure @aws-amplify/auth is imported',
        );

        try {
            const data = await Auth.forgotPassword(username);
            setDelivery(data.CodeDeliveryDetails);
        } catch (error) {
            console.log(error);
            showNotification({ content: 'ERRRO', variant: 'error' });
        }
    };

    return {
        delivery,
        submit,
        send,
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

export const ForgotPassword: React.FC = () => {
    const classes = useStyles();
    const { delivery, submit, send } = useForgotPassword();
    const { usernamefieldName, usernameField } = useUsernameField();
    const { authData = {} } = useAuthContext();

    const { username } = authData;

    const submitView = (): React.ReactElement => (
        <Formik<{ code: string; password: string }>
            initialValues={{
                code: '',
                password: '',
            }}
            onSubmit={async (
                { code, password },
                { setSubmitting },
            ): Promise<void> => {
                await submit(code, username, password);
                setSubmitting(false);
            }}
        >
            {({ handleSubmit, isValid }): React.ReactNode => (
                <FormSection>
                    <SectionHeader>
                        {I18n.get('Reset your password')}
                    </SectionHeader>
                    <Form className={classes.form} onSubmit={handleSubmit}>
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
                                type="submit"
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
                                        onClick={(): Promise<void> =>
                                            send(username)
                                        }
                                        variant="body2"
                                    >
                                        {I18n.get('Resend Code')}
                                    </Link>
                                </Grid>
                            </Grid>
                        </SectionFooter>
                    </Form>
                </FormSection>
            )}
        </Formik>
    );

    const sendView = (): React.ReactElement => (
        <Formik<{ [fieldName: string]: string }>
            initialValues={{
                [usernamefieldName]: '',
            }}
            onSubmit={async (values, { setSubmitting }): Promise<void> => {
                await send(values[usernamefieldName]);
                setSubmitting(false);
            }}
        >
            {({ handleSubmit, isValid }): React.ReactNode => (
                <FormSection>
                    <SectionHeader>
                        {I18n.get('Reset your password')}
                    </SectionHeader>
                    <Form className={classes.form} onSubmit={handleSubmit}>
                        <SectionBody>{usernameField}</SectionBody>
                        <SectionFooter>
                            <Button
                                type="submit"
                                disabled={!isValid}
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                {I18n.get('Send Code')}
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

    return delivery || username ? submitView() : sendView();
};
