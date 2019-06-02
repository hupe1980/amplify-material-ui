import * as React from 'react';
import { storiesOf } from '@storybook/react';
import Loading from '../loading';

const stories = storiesOf('Auth/Loading', module);

stories.add('without props', () => (
  <Loading authState="loading" onStateChange={() => {}} />
));
