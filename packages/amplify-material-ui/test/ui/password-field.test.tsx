import * as React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { PasswordField } from '../../src';

describe('password-field', () => {
  it('should be rendered correctly [type=password]', () => {
    const { asFragment } = render(<PasswordField />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should change the password visibility', () => {
    const { getByTestId } = render(<PasswordField />);

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
