import * as React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useAuthContext, useVerifyContact } from 'amplify-auth-hooks';
import { ConsoleLogger as Logger } from '@aws-amplify/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Formik, Field, Form } from 'formik';
import { RadioGroup, TextField } from 'formik-material-ui';

import { FormSection, SectionHeader, SectionBody, SectionFooter } from '../ui';
import { useNotificationContext } from '../notification';
import { ChangeAuthStateLink } from './change-auth-state-link';

const logger = new Logger('VerifyContact');

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

interface SubmitCodeProps {
  forceVerify?: boolean;
}

export const SubmitCode: React.FC<SubmitCodeProps> = (props) => {
  const classes = useStyles();
  const { forceVerify } = props;
  const { formatMessage } = useIntl();
  const { showNotification } = useNotificationContext();
  const { authData } = useAuthContext();
  const { submit } = useVerifyContact();

  const renderSectionHeader = (): React.ReactElement => (
    <SectionHeader>
      <FormattedMessage
        id="verifyContact.header"
        defaultMessage="Account recovery requires verified contact information"
      />
    </SectionHeader>
  );

  const renderSkipLink = (): React.ReactElement => (
    <Grid item xs>
      <ChangeAuthStateLink
        label={formatMessage({
          id: 'verifyContact.links.skip',
          defaultMessage: 'Skip',
        })}
        newState="signedIn"
        authData={authData}
      />
    </Grid>
  );

  const renderRequestCodeLink = (): React.ReactElement => (
    <Grid item>
      <ChangeAuthStateLink
        label={formatMessage({
          id: 'verifyContact.links.requestCode',
          defaultMessage: 'Request Code',
        })}
        newState="verifyContact"
        authData={authData}
      />
    </Grid>
  );

  const renderOptionsPanel = (): React.ReactElement => (
    <Grid container>
      {!forceVerify && renderSkipLink()}
      {forceVerify && renderRequestCodeLink()}
    </Grid>
  );

  return (
    <Formik<{ code: string }>
      initialValues={{
        code: '',
      }}
      key="verify-contract-submit-form"
      onSubmit={async ({ code }): Promise<void> => {
        try {
          await submit(code);
          localStorage.removeItem('codeRequested');
        } catch (error) {
          const content = formatMessage({
            id: `verifyContact.errors.${error.code}`,
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
              {renderOptionsPanel()}
            </SectionFooter>
          </Form>
        </FormSection>
      )}
    </Formik>
  );
};
