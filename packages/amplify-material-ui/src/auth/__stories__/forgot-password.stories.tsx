import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { ForgotPassword } from '../forgot-password';
import { withContext } from './helper';

const stories = storiesOf('Auth/ForgotPassword', module);

stories.add('default', () =>
    withContext({ authState: 'forgotPassword' })(<ForgotPassword />),
);
