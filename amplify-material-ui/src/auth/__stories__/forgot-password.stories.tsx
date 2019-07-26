import * as React from 'react';
import { storiesOf } from '@storybook/react';
import ForgotPassword from '../forgot-password';

const stories = storiesOf('Auth/ForgotPassword', module);

stories.add('default', () => (
    <ForgotPassword authState="forgotPassword" onStateChange={() => {}} />
));
