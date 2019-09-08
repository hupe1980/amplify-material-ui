import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { PasswordStrengthMeter } from '../password-strenght-meter';

const stories = storiesOf('UI/PasswordStrengthMeter', module);

stories.add('default', () => <PasswordStrengthMeter password="" />);

stories.add('weak', () => <PasswordStrengthMeter password="Hello123" />);

stories.add('fair', () => <PasswordStrengthMeter password="Hello123!()" />);

stories.add('good', () => <PasswordStrengthMeter password="Hello123!()aa" />);

stories.add('strong', () => (
    <PasswordStrengthMeter password="Hello123!()aaBB" />
));
