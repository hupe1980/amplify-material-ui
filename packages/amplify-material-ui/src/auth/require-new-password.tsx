import * as React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useRequireNewPassword } from 'amplify-auth-hooks';
import { Button, Grid } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';
import * as Yup from 'yup';

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
      validationSchema={Yup.object().shape({
        password: Yup.string().required('This field is required'),
        confirmPassword: Yup.string().when('password', {
          is: (val: string) => val && val.length,
          then: Yup.string().oneOf(
            [Yup.ref('password')],
            formatMessage({
              id: 'requireNewPassword.confirmPassword.notEqual',
              defaultMessage: 'passwords do not match',
            })
          ),
        }),
      })}
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
              <Field
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label={formatMessage({
                  id: 'global.labels.confirmPassword',
                  defaultMessage: 'Confirm Password',
                })}
                type="password"
                id="confirmPassword"
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
