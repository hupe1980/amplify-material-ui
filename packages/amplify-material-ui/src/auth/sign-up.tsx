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
import { I18n } from '@aws-amplify/core';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';

import { useAuthContext } from './auth-context';
import { FormSection, SectionHeader, SectionBody, SectionFooter } from '../ui';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';

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

export interface SignUpProps {
    validationData?: { [key: string]: string };
}

export const SignUp: React.FC<SignUpProps> = props => {
    const { onStateChange } = useAuthContext();
    const classes = useStyles();

    const signUp = async (email: string, password: string): Promise<void> => {
        invariant(
            Auth && typeof Auth.signUp === 'function',
            'No Auth module found, please ensure @aws-amplify/auth is imported',
        );

        const validationData = [];
        if (props.validationData) {
            for (const [name, value] of Object.entries(props.validationData)) {
                validationData.push(
                    new CognitoUserAttribute({ Name: name, Value: value }),
                );
            }
        }

        const signupInfo = {
            username: email,
            password: password,
            attributes: {},
            validationData,
        };

        try {
            const data = await Auth.signUp(signupInfo);
            onStateChange('confirmSignUp', data.user.getUsername());
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Formik<{ email: string; password: string }>
            initialValues={{
                email: '',
                password: '',
            }}
            onSubmit={async (
                { email, password },
                { setSubmitting },
            ): Promise<void> => {
                await signUp(email, password);
                setSubmitting(false);
            }}
        >
            {({ handleSubmit, isValid }): React.ReactNode => (
                <FormSection>
                    <SectionHeader>
                        {I18n.get('Sign in to your account')}
                    </SectionHeader>
                    <Form className={classes.form} onSubmit={handleSubmit}>
                        <SectionBody>
                            <Field
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                component={TextField}
                            />
                            <Field
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
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
                            >
                                Sign Up
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    Have an account?
                                    <Link
                                        href="#"
                                        onClick={(): void =>
                                            onStateChange('signIn', null)
                                        }
                                        variant="body2"
                                    >
                                        Sign in
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
