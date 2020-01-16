import * as React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useForgotPassword } from 'amplify-auth-hooks';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';

import { FormSection, SectionHeader, SectionBody, SectionFooter } from '../ui';
import { useNotificationContext } from '../notification';
import { useUsernameField } from './use-username-field';
import { ChangeAuthStateLink } from './change-auth-state-link';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  })
);

export const ForgotPassword: React.FC = () => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const { showNotification } = useNotificationContext();
  const { delivery, submit, send, username } = useForgotPassword();
  const { usernamefieldName, usernameField } = useUsernameField();

  const renderSectionHeader = (): React.ReactElement => (
    <SectionHeader>
      <FormattedMessage
        id="forgotPassword.header"
        defaultMessage="Reset your password"
      />
    </SectionHeader>
  );

  const submitView = (): React.ReactElement => (
    <Formik<{ code: string; password: string }>
      initialValues={{
        code: '',
        password: '',
      }}
      key="forgot-password-submit-form"
      onSubmit={async ({ code, password }): Promise<void> => {
        try {
          await submit(code, password);
        } catch (error) {
          const content = formatMessage({
            id: `forgotPassword.errors.${error.code}`,
            defaultMessage: error.message,
          });
          showNotification({ content, variant: 'error' });
        }
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
                autoFocus
                component={TextField}
              />
              <Field
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label={formatMessage({
                  id: 'global.labels.newPassword',
                  defaultMessage: 'New Password',
                })}
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
                <FormattedMessage
                  id="forgotPassword.buttons.submit"
                  defaultMessage="Submit"
                />
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link
                    href="#"
                    onClick={(): Promise<void> => send(username)}
                    variant="body2"
                  >
                    <FormattedMessage
                      id="forgotPassword.links.resendCode"
                      defaultMessage="Resend Code"
                    />
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
      key="forgot-password-send-form"
      onSubmit={async (values): Promise<void> => {
        try {
          await send(values[usernamefieldName]);
        } catch (error) {
          const content = formatMessage({
            id: `forgotPassword.errors.${error.code}`,
            defaultMessage: error.message,
          });
          showNotification({ content, variant: 'error' });
        }
      }}
    >
      {({ handleSubmit, isValid }): React.ReactNode => (
        <FormSection>
          {renderSectionHeader()}
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
                <FormattedMessage
                  id="forgotPassword.buttons.sendCode"
                  defaultMessage="Send Code"
                />
              </Button>
              <Grid container>
                <Grid item>
                  <ChangeAuthStateLink
                    label={formatMessage({
                      id: 'signIn.links.backToSignIn',
                      defaultMessage: 'Back to Sign In',
                    })}
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
