import * as React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useTOTPSetup } from 'amplify-auth-hooks';
import Button from '@material-ui/core/Button';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';
import QRCode from 'qrcode.react';

import { FormSection, SectionHeader, SectionBody, SectionFooter } from '../ui';
import { useNotificationContext } from '../notification';
import { Loading } from './loading';

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

export const TOTPSetup: React.FC = () => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const { showNotification } = useNotificationContext();
  const { code, verifyTotpToken } = useTOTPSetup();

  if (!code) return <Loading />;

  return (
    <Formik<{ totpCode: string }>
      initialValues={{
        totpCode: '',
      }}
      onSubmit={async ({ totpCode }): Promise<void> => {
        try {
          await verifyTotpToken(totpCode);
        } catch (error) {
          const content = formatMessage({
            id: `totpSetup.errors.${error.code}`,
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
              id="totpSetup.header"
              defaultMessage="Scan then enter verification code"
            />
          </SectionHeader>
          <Form
            className={classes.form}
            onSubmit={handleSubmit}
            //noValidate
          ></Form>
          <SectionBody>
            <QRCode value={code} />
            <Field
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="totpCode"
              label={formatMessage({
                id: 'totpSetup.labels.totpCode',
                defaultMessage: 'Enter Security Code:',
              })}
              name="totpCode"
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
                id="totpSetup.buttons.verifyTotpToken"
                defaultMessage="Verify Security Token"
              />
            </Button>
          </SectionFooter>
        </FormSection>
      )}
    </Formik>
  );
};
