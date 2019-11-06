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
import { I18n } from '@aws-amplify/core';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';

import { useAuthContext } from './auth-context';
import { useCheckContact } from './use-check-contact';
import { ChangeAuthStateLink } from './change-auth-state-link';
import { FormSection, SectionHeader, SectionBody, SectionFooter } from '../ui';

export const useMfaType = (user: { challengeName: string }): string => {
    const [mfaType, setMfaType] = React.useState('SMS');

    React.useEffect(() => {
        const newMfaType =
            user && user.challengeName === 'SOFTWARE_TOKEN_MFA'
                ? 'TOTP'
                : 'SMS';
        if (mfaType !== newMfaType) {
            setMfaType(newMfaType);
        }
    }, [mfaType, user]);

    return mfaType;
};

export const useConfirmSignIn = (
    mfaType: string,
): ((code: string) => Promise<void>) => {
    const { authData: user } = useAuthContext();

    const checkContact = useCheckContact();

    return async (code: string): Promise<void> => {
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

export const ConfirmSignIn: React.FC = () => {
    const { authData: user } = useAuthContext();

    const classes = useStyles();

    const mfaType = useMfaType(user);

    const confirmSignIn = useConfirmSignIn(mfaType);

    return (
        <Formik<{ code: string }>
            initialValues={{
                code: '',
            }}
            onSubmit={async ({ code }, { setSubmitting }): Promise<void> => {
                await confirmSignIn(code);
                setSubmitting(false);
            }}
        >
            {({ handleSubmit, isValid }): React.ReactNode => (
                <FormSection>
                    <SectionHeader>
                        {I18n.get('Confirm ' + mfaType + ' Code')}
                    </SectionHeader>
                    <Form className={classes.form} onSubmit={handleSubmit}>
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
