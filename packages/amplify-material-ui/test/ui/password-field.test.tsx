import * as React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { PasswordField } from '../../src';
import { withTheme } from '../helpers/withTheme';

describe('password-field', () => {
  it('should be rendered correctly [type=password]', () => {
    const { asFragment } = render(withTheme(<PasswordField />));
    expect(asFragment()).toMatchSnapshot();
  });

  it('should change the password visibility', () => {
    const { getByTestId } = render(withTheme(<PasswordField />));

    const passwordInput = getByTestId('password-input') as HTMLInputElement;

    act(() => {
      fireEvent.click(getByTestId('togglePasswordVisibility'));
    });

    expect(passwordInput.type).toEqual('text');

    act(() => {
      fireEvent.click(getByTestId('togglePasswordVisibility'));
    });

    expect(passwordInput.type).toEqual('password');
  });
});
