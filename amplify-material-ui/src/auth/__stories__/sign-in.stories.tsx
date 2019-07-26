import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { SignIn } from '../sign-in';

const stories = storiesOf('Auth/SignIn', module);

stories.add('default', () => (
    <SignIn authState="signIn" onStateChange={() => {}} />
));
