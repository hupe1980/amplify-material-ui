import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Toast } from '../toast';

const stories = storiesOf('UI/Toast', module);

stories.add('success', () => (
    <Toast variant="success" message="This is a success message!" />
));

stories.add('error', () => (
    <Toast variant="error" message="This is a error message!" />
));

stories.add('warning', () => (
    <Toast variant="warning" message="This is a warning message!" />
));

stories.add('info', () => (
    <Toast variant="info" message="This is a info message!" />
));
