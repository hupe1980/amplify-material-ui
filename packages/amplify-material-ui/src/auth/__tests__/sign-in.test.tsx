import * as React from 'react';
import Auth from '@aws-amplify/auth';
import { render, cleanup, fireEvent, act, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { SignIn } from '../sign-in';
import { withContext } from './helper';

describe('sign-in', () => {
    const handleStateChange = jest.fn();

    beforeEach(() => cleanup());

    it('should be rendered correctly', () => {
        const { asFragment } = render(withContext(<SignIn />)());
        expect(asFragment()).toMatchSnapshot();
    });

    it('should hide the signup link', () => {
        const { getByTestId, queryByTestId } = render(
            withContext(<SignIn hideSignUpLink />)(),
        );

        const forgotPasswordLink = getByTestId('forgot-password-link');
        expect(forgotPasswordLink).toBeInTheDocument();

        const signUpLink = queryByTestId('sign-up-link');
        expect(signUpLink).not.toBeInTheDocument();
    });

    it('should hide the forgot password link', () => {
        const { getByTestId, queryByTestId } = render(
            withContext(<SignIn hideForgotPasswordLink />)(),
        );

        const signUpLink = getByTestId('sign-up-link');
        expect(signUpLink).toBeInTheDocument();

        const forgotPasswordLink = queryByTestId('forgot-password-link');
        expect(forgotPasswordLink).not.toBeInTheDocument();
    });

    it('it should change state to requireNewPassword if challengeName equals NEW_PASSWORD_REQUIRED', async () => {
        jest.spyOn(Auth, 'signIn').mockImplementationOnce(() => {
            return new Promise(res =>
                res({
                    challengeName: 'NEW_PASSWORD_REQUIRED',
                }),
            );
        });

        const { getByTestId, getByLabelText } = render(
            withContext(<SignIn />)({
                authState: 'signIn',
                handleStateChange: handleStateChange,
            }),
        );

        const usernameInput = getByLabelText('Username', {
            exact: false,
            selector: 'input',
        });

        const passwordInput = getByLabelText('Password', {
            exact: false,
            selector: 'input',
        });

        act(() => {
            fireEvent.change(usernameInput, {
                target: { value: 'test@test.de' },
            });

            fireEvent.change(passwordInput, {
                target: { value: 'Qwertz123!' },
            });

            fireEvent.click(getByTestId('signInSubmit'));
        });

        await wait(() => {
            expect(handleStateChange).toHaveBeenCalledTimes(1);
            expect(handleStateChange).toHaveBeenCalledWith(
                'requireNewPassword',
                {
                    challengeName: 'NEW_PASSWORD_REQUIRED',
                },
            );
        });
    });
});
