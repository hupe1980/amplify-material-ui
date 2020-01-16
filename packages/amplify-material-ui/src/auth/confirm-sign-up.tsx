import * as React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useConfirmSignUp } from 'amplify-auth-hooks';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
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

export const ConfirmSignUp: React.FC = () => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const { showNotification } = useNotificationContext();
  const { confirm, resend } = useConfirmSignUp();

  return (
    <Formik<{ code: string }>
      initialValues={{
        code: '',
      }}
      onSubmit={async ({ code }): Promise<void> => {
        try {
          await confirm(code);
        } catch (error) {
          const content = formatMessage({
            id: `confirmSignUp.errors.${error.code}`,
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
              id="confirmSignUp.header"
              defaultMessage="Confirm Sign Up"
            />
          </SectionHeader>
          <Form className={classes.form} onSubmit={handleSubmit}>
            <SectionBody>
              <Field
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="code"
                label={formatMessage({
                  id: 'global.labels.confirmationCode',
                  defaultMessage: 'Confirmation Code',
                })}
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
                <FormattedMessage
                  id="confirmSignUp.buttons.confirm"
                  defaultMessage="Confirm"
                />
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" onClick={resend} variant="body2">
                    <FormattedMessage
                      id="confirmSignUp.links.resendCode"
                      defaultMessage="Resend Code"
                    />
                  </Link>
                </Grid>
                <Grid item>
                  <ChangeAuthStateLink
                    label={formatMessage({
                      id: 'confirmSignUp.links.backToSignIn',
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
