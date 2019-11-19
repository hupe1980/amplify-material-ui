import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useConfirmSignUp } from 'amplify-auth-hooks';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { I18n } from '@aws-amplify/core';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';

import { ChangeAuthStateLink } from './change-auth-state-link';
import { FormSection, SectionHeader, SectionBody, SectionFooter } from '../ui';

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

  const { confirm, resend } = useConfirmSignUp();

  return (
    <Formik<{ code: string }>
      initialValues={{
        code: '',
      }}
      onSubmit={async ({ code }, { setSubmitting }): Promise<void> => {
        await confirm(code);
        setSubmitting(false);
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
                label={`${I18n.get('Confirmation Code')} *`}
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
                {I18n.get('Confirm')}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" onClick={resend} variant="body2">
                    {I18n.get('Resend Code')}
                  </Link>
                </Grid>
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
};
