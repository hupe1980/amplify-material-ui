import * as React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useAuthContext, useVerifyContact } from 'amplify-auth-hooks';
import { ConsoleLogger as Logger } from '@aws-amplify/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
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

export interface VerifyContactProps {
  forceVerify?: boolean;
}

export const VerifyContact: React.FC<VerifyContactProps> = (props) => {
  const { forceVerify = false } = props;

  const classes = useStyles();
  const { formatMessage } = useIntl();
  const { showNotification } = useNotificationContext();
  const { authData, handleStateChange } = useAuthContext();
  const { verifyAttr, verify, submit } = useVerifyContact();
  const codeRequested = localStorage.getItem('codeRequested');

  localStorage.setItem('verifyAttr', verifyAttr);

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

  const renderLinkToVerifyView = (): React.ReactElement => (
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

  const renderLinkToSubmitView = (): React.ReactElement => (
    <Grid item>
      <ChangeAuthStateLink
        label={formatMessage({
          id: 'verifyContact.links.codeInput',
          defaultMessage: 'Code Input',
        })}
        newState="submitCode"
        authData={authData}
      />
    </Grid>
  );

  const renderOptionsPanel = (): React.ReactElement => (
    <Grid container>
      {!forceVerify && renderSkipLink()}
      {forceVerify && renderLinkToSubmitView()}
    </Grid>
  );

  const renderSectionHeader = (): React.ReactElement => (
    <SectionHeader>
      <FormattedMessage
        id="verifyContact.header"
        defaultMessage="Account recovery requires verified contact information"
      />
    </SectionHeader>
  );

  const { unverified } = authData;
  if (!unverified) {
    logger.debug('no unverified on user');
    return null;
  }

  const { email, phone_number: phoneNumber } = unverified;

  return (
    <Formik<{ contact: string }>
      initialValues={{
        contact: '',
      }}
      key="verify-contract-verify-form"
      onSubmit={async ({ contact }): Promise<void> => {
        try {
          await verify(contact);
          handleStateChange('submitCode', authData);
        } catch (error) {
          const content = formatMessage({
            id: `verifyContact.errors.${error.code}`,
            defaultMessage: error.message,
          });
          showNotification({ content, variant: 'error' });
        }
      }}
    >
      {({ handleSubmit, isSubmitting, isValid }): React.ReactNode => (
        <FormSection>
          {renderSectionHeader()}
          <Form className={classes.form} onSubmit={handleSubmit}>
            <SectionBody>
              <Field
                name="contact"
                label="Radio Group"
                component={RadioGroup}
              >
                {email && (
                  <FormControlLabel
                    value="email"
                    control={<Radio disabled={isSubmitting} />}
                    label={formatMessage({
                      id: 'global.labels.email',
                      defaultMessage: 'Email',
                    })}
                    disabled={isSubmitting}
                  />
                )}
                {phoneNumber && (
                  <FormControlLabel
                    value="phoneNumber"
                    control={<Radio disabled={isSubmitting} />}
                    label={formatMessage({
                      id: 'global.labels.phoneNumber',
                      defaultMessage: 'Phone Number',
                    })}
                    disabled={isSubmitting}
                  />
                )}
              </Field>
            </SectionBody>
            <SectionFooter>
              <Button
                disabled={!isValid}
                type="submit"
                className={classes.submit}
              >
                <FormattedMessage
                  id="verifyContact.buttons.verify"
                  defaultMessage="Verify"
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
