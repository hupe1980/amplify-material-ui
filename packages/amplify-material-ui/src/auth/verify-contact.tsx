import * as React from 'react';
import invariant from 'tiny-invariant';
import {
    Button,
    Grid,
    FormControlLabel,
    Radio,
    makeStyles,
    createStyles,
    Theme,
} from '@material-ui/core';
import Auth from '@aws-amplify/auth';
import { ConsoleLogger as Logger, I18n } from '@aws-amplify/core';
import { Formik, Field, Form } from 'formik';
import { RadioGroup, TextField } from 'formik-material-ui';

import { useAuthContext } from './auth-context';
import { ChangeAuthStateLink } from './change-auth-state-link';
import { FormSection, SectionHeader, SectionBody, SectionFooter } from '../ui';

const logger = new Logger('VerifyContact');

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

export const VerifyContact: React.FC = () => {
    const { onStateChange, authData } = useAuthContext();
    const [verifyAttr, setVerifyAttr] = React.useState<string | null>(null);

    const classes = useStyles();

    const verify = async (contact: string): Promise<void> => {
        invariant(
            Auth && typeof Auth.verifyCurrentUserAttribute === 'function',
            'No Auth module found, please ensure @aws-amplify/auth is imported',
        );

        try {
            const data = await Auth.verifyCurrentUserAttribute(contact);
            logger.debug(data);
            setVerifyAttr(contact);
        } catch (error) {
            console.log(error); /*this.error(err)*/
        }
    };

    const submit = async (code: string): Promise<void> => {
        if (!verifyAttr) {
            return;
        }

        invariant(
            Auth && typeof Auth.verifyCurrentUserAttributeSubmit === 'function',
            'No Auth module found, please ensure @aws-amplify/auth is imported',
        );

        try {
            await Auth.verifyCurrentUserAttributeSubmit(verifyAttr, code);
            onStateChange('signedIn', authData);
            setVerifyAttr(null);
        } catch (error) {
            console.log(error); //TODO
        }
    };

    const skipLinkPanel = (): React.ReactElement => (
        <Grid container>
            <Grid item>
                <ChangeAuthStateLink
                    label={I18n.get('Skip')}
                    newState="signedIn"
                    authData={authData}
                />
            </Grid>
        </Grid>
    );

    const verifyView = (): React.ReactElement | null => {
        const { unverified } = authData;
        if (!unverified) {
            logger.debug('no unverified on user');
            return null;
        }

        const { email, phone_number: phoneNumber } = unverified;

        return (
            <Formik<{ contact: string }>
                initialValues={{
                    contact: '',
                }}
                onSubmit={async (
                    { contact },
                    { setSubmitting },
                ): Promise<void> => {
                    await verify(contact);
                    setSubmitting(false);
                }}
            >
                {({ handleSubmit, isSubmitting, isValid }): React.ReactNode => (
                    <FormSection>
                        <SectionHeader>
                            {I18n.get(
                                'Account recovery requires verified contact information',
                            )}
                        </SectionHeader>
                        <Form className={classes.form} onSubmit={handleSubmit}>
                            <SectionBody>
                                <Field
                                    name="contact"
                                    label="Radio Group"
                                    component={RadioGroup}
                                >
                                    {email && (
                                        <FormControlLabel
                                            value="email"
                                            control={
                                                <Radio
                                                    disabled={isSubmitting}
                                                />
                                            }
                                            label={I18n.get('Email')}
                                            disabled={isSubmitting}
                                        />
                                    )}
                                    {phoneNumber && (
                                        <FormControlLabel
                                            value="phoneNumber"
                                            control={
                                                <Radio
                                                    disabled={isSubmitting}
                                                />
                                            }
                                            label={I18n.get('Phone Number')}
                                            disabled={isSubmitting}
                                        />
                                    )}
                                </Field>
                            </SectionBody>
                            <SectionFooter>
                                <Button
                                    disabled={!isValid}
                                    type="submit"
                                    className={classes.submit}
                                >
                                    {I18n.get('Verify')}
                                </Button>
                                {skipLinkPanel()}
                            </SectionFooter>
                        </Form>
                    </FormSection>
                )}
            </Formik>
        );
    };

    const submitView = (): React.ReactElement => (
        <Formik<{ code: string }>
            initialValues={{
                code: '',
            }}
            onSubmit={async ({ code }, { setSubmitting }): Promise<void> => {
                await submit(code);
                setSubmitting(false);
            }}
        >
            {({ handleSubmit, isValid }): React.ReactNode => (
                <FormSection>
                    <SectionHeader>
                        {I18n.get(
                            'Account recovery requires verified contact information',
                        )}
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
                                disabled={!isValid}
                                type="submit"
                                className={classes.submit}
                            >
                                {I18n.get('Submit')}
                            </Button>
                            {skipLinkPanel()}
                        </SectionFooter>
                    </Form>
                </FormSection>
            )}
        </Formik>
    );

    return verifyAttr ? submitView() : verifyView();
};
