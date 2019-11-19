import * as React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useAuthContext, useForgotPassword } from 'amplify-auth-hooks';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { I18n } from '@aws-amplify/core';
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
  const { delivery, submit, send } = useForgotPassword();
  const { usernamefieldName, usernameField } = useUsernameField();
  const { authData = {} } = useAuthContext();

  const { username } = authData;

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
      onSubmit={async (
        { code, password },
        { setSubmitting }
      ): Promise<void> => {
        try {
          await submit(code, username, password);
        } catch (error) {
          showNotification({ content: error.message, variant: 'error' });
        }

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
                    onClick={(): Promise<void> => send(username)}
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
        try {
          await send(values[usernamefieldName]);
        } catch (error) {
          showNotification({ content: error.message, variant: 'error' });
        }

        setSubmitting(false);
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
