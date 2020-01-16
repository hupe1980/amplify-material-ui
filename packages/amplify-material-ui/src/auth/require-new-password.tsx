import * as React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useRequireNewPassword } from 'amplify-auth-hooks';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';

import { FormSection, SectionHeader, SectionBody, SectionFooter } from '../ui';
import { useNotificationContext } from '../notification';
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

export const RequireNewPassword: React.FC = () => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const { showNotification } = useNotificationContext();
  const completeNewPassword = useRequireNewPassword();

  return (
    <Formik<{ password: string }>
      initialValues={{
        password: '',
      }}
      onSubmit={async ({ password }): Promise<void> => {
        try {
          await completeNewPassword(password);
        } catch (error) {
          const content = formatMessage({
            id: `requireNewPassword.errors.${error.code}`,
            defaultMessage: error.message,
          });
          showNotification({ content, variant: 'error' });
        }
      }}
    >
      {({ handleSubmit, isValid }): React.ReactNode => (
        <FormSection>
          <SectionHeader>
            <FormattedMessage
              id="requireNewPassword.header"
              defaultMessage="Change Password"
            />
          </SectionHeader>
          <Form className={classes.form} onSubmit={handleSubmit}>
            <SectionBody>
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
                  id="requireNewPassword.buttons.change"
                  defaultMessage="Change"
                />
              </Button>
              <Grid container>
                <Grid item>
                  <ChangeAuthStateLink
                    label={formatMessage({
                      id: 'requireNewPassword.links.backToSignIn',
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
};
