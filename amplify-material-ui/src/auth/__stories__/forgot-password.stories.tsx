import * as React from 'react';
import { storiesOf } from '@storybook/react';
import ForgotPassword from '../forgot-password';

const stories = storiesOf('Auth/ForgotPassword', module);

stories.add('without props', () => (
    <ForgotPassword authState="forgotPassword" onStateChange={() => {}} />
));
