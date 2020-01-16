import * as React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useSignUp } from 'amplify-auth-hooks';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';

import { FormSection, SectionHeader, SectionBody, SectionFooter } from '../ui';
import { useNotificationContext } from '../notification';
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

const signUpFields = [
  {
    label: 'Username',
    key: 'username',
    required: true,
    placeholder: 'Username',
    displayOrder: 1,
  },
  {
    label: 'Password',
    key: 'password',
    required: true,
    placeholder: 'Password',
    type: 'password',
    displayOrder: 2,
  },
  {
    label: 'Email',
    key: 'email',
    required: true,
    placeholder: 'Email',
    type: 'email',
    displayOrder: 3,
  },
];

export interface SignUpProps {
  validationData?: { [key: string]: string };
  usernameAttribute?: UsernameAttribute;
}

export const SignUp: React.FC<SignUpProps> = props => {
  const { validationData } = props;

  const classes = useStyles();
  const { formatMessage } = useIntl();
  const { showNotification } = useNotificationContext();
  const signUp = useSignUp();

  return (
    <Formik<{ email: string; password: string }>
      initialValues={{
        email: '',
        password: '',
      }}
      onSubmit={async ({ email, password }): Promise<void> => {
        try {
          await signUp(email, password, validationData);
        } catch (error) {
          const content = formatMessage({
            id: `signUp.errors.${error.code}`,
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
              id="signUp.header"
              defaultMessage="Create a new account"
            />
          </SectionHeader>
          <Form className={classes.form} onSubmit={handleSubmit}>
            <SectionBody>
              {signUpFields.map(field => (
                <Field
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  key={field.key}
                  name={field.key}
                  label={field.label}
                  component={TextField}
                />
              ))}
              {/* <Field
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label={formatMessage({
                  id: 'global.labels.email',
                  defaultMessage: 'Email',
                })}
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
                label={formatMessage({
                  id: 'global.labels.password',
                  defaultMessage: 'Password',
                })}
                type="password"
                id="password"
                autoComplete="current-password"
                component={TextField}
              /> */}
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
                  id="signUp.buttons.create"
                  defaultMessage="Create Account"
                />
              </Button>
              <Grid container>
                <Grid item xs>
                  <FormattedMessage
                    id="signUp.text.haveAccount"
                    defaultMessage="Have an account?"
                  />{' '}
                  <ChangeAuthStateLink
                    label={formatMessage({
                      id: 'signUp.links.signIn',
                      defaultMessage: 'Sign in',
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
