import * as React from 'react';
import { render } from '@testing-library/react';
import { PasswordStrengthMeter } from '../../src';

describe('loading', () => {
  it('should be rendered correctly', () => {
    const { asFragment } = render(
      <PasswordStrengthMeter password="PASSWORD" />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
