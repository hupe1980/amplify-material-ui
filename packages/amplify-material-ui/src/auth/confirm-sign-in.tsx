import * as React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useConfirmSignIn } from 'amplify-auth-hooks';
import {
  Button,
  Grid,
  makeStyles,
  createStyles,
  Theme,
} from '@material-ui/core';
import { I18n } from '@aws-amplify/core';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';

import { FormSection, SectionHeader, SectionBody, SectionFooter } from '../ui';
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

export const ConfirmSignIn: React.FC = () => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const { confirm, mfaType } = useConfirmSignIn();

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
              id="confirmSignIn.header"
              defaultMessage="Confirm {mfaType} Code"
              values={{ mfaType }}
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
