import * as React from 'react';
import Auth from '@aws-amplify/auth';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { SignIn } from '../sign-in';

describe('sign-in', () => {
    beforeEach(() => cleanup());

    it('should be rendered correctly in the signIn authState', () => {
        const { asFragment } = render(
            <SignIn onStateChange={() => {}} authState="signIn" />,
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('it should change state to requireNewPassword if challengeName equals NEW_PASSWORD_REQUIRED', async () => {
        const handleStateChange = jest.fn();

        jest.spyOn(Auth, 'signIn').mockImplementationOnce((user, password) => {
            return new Promise((res, rej) => {
                res({
                    challengeName: 'NEW_PASSWORD_REQUIRED',
                });
            });
        });

        const { getByTestId, getByLabelText } = render(
            <SignIn onStateChange={handleStateChange} authState="signIn" />,
        );

        const usernameInput = getByLabelText('Username', {
            exact: false,
            selector: 'input',
        });
        fireEvent.change(usernameInput, { target: { value: 'test@test.de' } });

        const passwordInput = getByLabelText('Password', {
            exact: false,
            selector: 'input',
        });
        fireEvent.change(passwordInput, { target: { value: 'Qwertz123!' } });

        fireEvent.click(getByTestId('signInSubmit'));

        await Promise.resolve();

        expect(handleStateChange).toHaveBeenCalledTimes(1);
        expect(handleStateChange).toHaveBeenCalledWith('requireNewPassword', {
            challengeName: 'NEW_PASSWORD_REQUIRED',
        });
    });
});
