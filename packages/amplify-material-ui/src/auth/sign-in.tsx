import * as React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';
import { useSignIn } from 'amplify-auth-hooks';

import { FormSection, SectionHeader, SectionBody, SectionFooter } from '../ui';
import { useNotificationContext } from '../notification';
import { useUsernameField } from './use-username-field';
import { ChangeAuthStateLink } from './change-auth-state-link';
import { UsernameAttribute } from './types';

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

export interface SignInProps {
  validationData?: { [key: string]: string };
  hideSignUpLink?: boolean;
  hideForgotPasswordLink?: boolean;
  usernameAttribute?: UsernameAttribute;
}

export const SignIn: React.FC<SignInProps> = (props) => {
  const {
    validationData,
    hideSignUpLink = false,
    hideForgotPasswordLink = false,
    usernameAttribute,
  } = props;

  const classes = useStyles();
  const { formatMessage } = useIntl();
  const { showNotification } = useNotificationContext();
  const signIn = useSignIn();
  const { usernamefieldName, usernameField } = useUsernameField(
    usernameAttribute
  );

  return (
    <Formik<{ [fieldName: string]: string; password: string }>
      initialValues={{
        [usernamefieldName]: '',
        password: '',
      }}
      onSubmit={async (values): Promise<void> => {
        try {
          await signIn(
            values[usernamefieldName].trim(),
            values['password'].trim(),
            validationData
          );
        } catch (error) {
          const content = formatMessage({
            id: `signIn.errors.${error.code}`,
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
              id="signIn.header"
              defaultMessage="Sign in to your account"
            />
          </SectionHeader>
          <Form
            className={classes.form}
            onSubmit={handleSubmit}
            data-testid="signInForm"
            //noValidate
          >
            <SectionBody>
              {usernameField}
              <Field
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label={formatMessage({
                  id: 'global.labels.password',
                  defaultMessage: 'Password',
                })}
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
                data-testid="signInSubmit"
              >
                <FormattedMessage
                  id="signIn.buttons.signIn"
                  defaultMessage="Sign In"
                />
              </Button>
              <Grid container>
                {!hideForgotPasswordLink && (
                  <Grid item xs>
                    <ChangeAuthStateLink
                      label={formatMessage({
                        id: 'signIn.links.forgotPassword',
                        defaultMessage: 'Reset password',
                      })}
                      newState="forgotPassword"
                      data-testid="forgot-password-link"
                    />
                  </Grid>
                )}
                {!hideSignUpLink && (
                  <Grid item>
                    <ChangeAuthStateLink
                      label={formatMessage({
                        id: 'signIn.links.signUp',
                        defaultMessage: 'Create account',
                      })}
                      newState="signUp"
                      data-testid="sign-up-link"
                    />
                  </Grid>
                )}
              </Grid>
            </SectionFooter>
          </Form>
        </FormSection>
      )}
    </Formik>
  );
};
