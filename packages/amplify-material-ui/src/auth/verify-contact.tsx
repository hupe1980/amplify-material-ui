import * as React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
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
import { ConsoleLogger as Logger } from '@aws-amplify/core';
import { Formik, Field, Form } from 'formik';
import { RadioGroup, TextField } from 'formik-material-ui';

import { useAuthContext } from './auth-context';
import { useNotificationContext } from './notification-context';
import { ChangeAuthStateLink } from './change-auth-state-link';
import { FormSection, SectionHeader, SectionBody, SectionFooter } from '../ui';

const logger = new Logger('VerifyContact');

const useVerifyContact = () => {
    const { handleStateChange, authData } = useAuthContext();
    const { showNotification } = useNotificationContext();
    const [verifyAttr, setVerifyAttr] = React.useState<string | null>(null);

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
            logger.error(error);
            showNotification({
                content: error.message,
                variant: 'error',
            });
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
            handleStateChange('signedIn', authData);
            setVerifyAttr(null);
        } catch (error) {
            logger.error(error);
            showNotification({
                content: error.message,
                variant: 'error',
            });
        }
    };

    return {
        verifyAttr,
        verify,
        submit,
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

export const VerifyContact: React.FC = () => {
    const { authData } = useAuthContext();
    const { verifyAttr, verify, submit } = useVerifyContact();

    const classes = useStyles();
    const { formatMessage } = useIntl();

    const renderSkipLinkPanel = (): React.ReactElement => (
        <Grid container>
            <Grid item>
                <ChangeAuthStateLink
                    label={formatMessage({
                        id: 'verifyContact.links.skip',
                        defaultMessage: 'Skip',
                    })}
                    newState="signedIn"
                    authData={authData}
                />
            </Grid>
        </Grid>
    );

    const renderSectionHeader = (): React.ReactElement => (
        <SectionHeader>
            <FormattedMessage
                id="verifyContact.header"
                defaultMessage="Account recovery requires verified contact information"
            />
        </SectionHeader>
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
                        {renderSectionHeader()}
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
                                            label={formatMessage({
                                                id: 'global.labels.email',
                                                defaultMessage: 'Email',
                                            })}
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
                                            label={formatMessage({
                                                id: 'global.labels.phoneNumber',
                                                defaultMessage: 'Phone Number',
                                            })}
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
                                    <FormattedMessage
                                        id="verifyContact.buttons.verify"
                                        defaultMessage="Verify"
                                    />
                                </Button>
                                {renderSkipLinkPanel()}
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
                    {renderSectionHeader()}
                    <Form className={classes.form} onSubmit={handleSubmit}>
                        <SectionBody>
                            <Field
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="code"
                                label={formatMessage({
                                    id: 'global.labels.code',
                                    defaultMessage: 'Code',
                                })}
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
                                <FormattedMessage
                                    id="verifyContact.buttons.submit"
                                    defaultMessage="Submit"
                                />
                            </Button>
                            {renderSkipLinkPanel()}
                        </SectionFooter>
                    </Form>
                </FormSection>
            )}
        </Formik>
    );

    return verifyAttr ? submitView() : verifyView();
};
