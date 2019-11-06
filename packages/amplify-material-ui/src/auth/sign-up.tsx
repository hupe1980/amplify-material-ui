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
import { ChangeAuthStateLink } from './change-auth-state-link';
import { FormSection, SectionHeader, SectionBody, SectionFooter } from '../ui';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';

export const useSignUp = (validationData?: {
    [key: string]: string;
}): ((username: string, password: string) => Promise<void>) => {
    const { onStateChange } = useAuthContext();

    const validationDataArray: CognitoUserAttribute[] = [];
    if (validationData) {
        for (const [name, value] of Object.entries(validationData)) {
            validationDataArray.push(
                new CognitoUserAttribute({ Name: name, Value: value }),
            );
        }
    }

    return async (email: string, password: string): Promise<void> => {
        invariant(
            Auth && typeof Auth.signUp === 'function',
            'No Auth module found, please ensure @aws-amplify/auth is imported',
        );

        const signupInfo = {
            username: email,
            password: password,
            attributes: {},
            validationData: validationDataArray,
        };

        try {
            const data = await Auth.signUp(signupInfo);
            onStateChange('confirmSignUp', data.user.getUsername());
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

export interface SignUpProps {
    validationData?: { [key: string]: string };
}

export const SignUp: React.FC<SignUpProps> = props => {
    const { validationData } = props;

    const classes = useStyles();

    const signUp = useSignUp(validationData);

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
                                {I18n.get('Create Account')}
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    {I18n.get('Have an account? ')}
                                    <ChangeAuthStateLink
                                        label={I18n.get('Sign in')}
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
