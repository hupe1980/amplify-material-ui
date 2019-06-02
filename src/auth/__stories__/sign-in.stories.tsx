import * as React from 'react';
import { storiesOf } from '@storybook/react';
import SignIn from '../sign-in';

const stories = storiesOf('Auth/SignIn', module);

stories.add('without props', () => (
  <SignIn authState="signIn" onStateChange={() => {}} />
));
