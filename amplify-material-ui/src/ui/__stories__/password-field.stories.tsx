import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { PasswordField } from '../password-field';

const stories = storiesOf('UI/PasswordField', module);

stories.add('default', () => <PasswordField />);

stories.add('styled', () => (
    <PasswordField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        id="password"
        autoComplete="current-password"
    />
));
