import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { SignIn } from '../sign-in';
import { withContext } from './helper';

const stories = storiesOf('Auth/SignIn', module);

stories.add('default', () => withContext({ authState: 'signIn ' })(<SignIn />));
