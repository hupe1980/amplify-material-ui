import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import { I18n } from '@aws-amplify/core';
import QRCode from 'qrcode.react';

import { FormSection, SectionHeader, SectionBody, SectionFooter } from '../ui';
import { useTOTPSetup } from 'amplify-auth-hooks';
import { Loading } from './loading';

export const TOTPSetup: React.FC = () => {
  const { code } = useTOTPSetup();

  if (!code) return <Loading />;

  return (
    <FormSection>
      <SectionHeader>
        <FormattedMessage
          id="totpSetup.header"
          defaultMessage="Scan then enter verification code"
        />
      </SectionHeader>
      <SectionBody>
        <QRCode value={code} />
      </SectionBody>
      <SectionFooter>
        <Button>{I18n.get('Verify Security Token')}</Button>
      </SectionFooter>
    </FormSection>
  );
};
