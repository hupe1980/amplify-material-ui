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
import { I18n, Logger } from '@aws-amplify/core';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';

import { useAuthContext } from './auth-context';
import { ChangeAuthStateLink } from './change-auth-state-link';
import { FormSection, SectionHeader, SectionBody, SectionFooter } from '../ui';

const logger = new Logger('ConfirmSignUp');

export const useConfirmSignUp = (): ((code: string) => Promise<void>) => {
    const { handleStateChange, authData = {} } = useAuthContext();

    const { username } = authData;

    return async (code: string): Promise<void> => {
        invariant(
            Auth && typeof Auth.confirmSignUp === 'function',
            'No Auth module found, please ensure @aws-amplify/auth is imported',
        );

        try {
            await Auth.confirmSignUp(username, code);
            handleStateChange('signedUp', null);
        } catch (error) {
            console.log(error);
        }
    };
};

export const useResendSignUp = (): (() => Promise<void>) => {
    const { authData = {} } = useAuthContext();

    const { username } = authData;

    return async (): Promise<void> => {
        invariant(
            Auth && typeof Auth.resendSignUp === 'function',
            'No Auth module found, please ensure @aws-amplify/auth is imported',
        );

        try {
            await Auth.resendSignUp(username);
            logger.debug('code resent');
        } catch (error) {
            console.log(error);
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

export const ConfirmSignUp: React.FC = () => {
    const classes = useStyles();

    const confirmSignUp = useConfirmSignUp();

    const resendSignUp = useResendSignUp();

    return (
        <Formik<{ code: string }>
            initialValues={{
                code: '',
            }}
            onSubmit={async ({ code }, { setSubmitting }): Promise<void> => {
                await confirmSignUp(code);
                setSubmitting(false);
            }}
        >
            {({ handleSubmit, isValid }): React.ReactNode => (
                <FormSection>
                    <SectionHeader>{I18n.get('Confirm Sign Up')}</SectionHeader>
                    <Form className={classes.form} onSubmit={handleSubmit}>
                        <SectionBody>
                            <Field
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="code"
                                label={`${I18n.get('Confirmation Code')} *`}
                                name="code"
                                autoComplete="code"
                                autoFocus
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
                                {I18n.get('Confirm')}
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link
                                        href="#"
                                        onClick={resendSignUp}
                                        variant="body2"
                                    >
                                        {I18n.get('Resend Code')}
                                    </Link>
                                </Grid>
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
