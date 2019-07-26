import * as React from 'react';
import Auth from '@aws-amplify/auth';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { SignIn } from '../sign-in';

const acceptedStates = ['signIn', 'signedUp', 'signedOut'];
const deniedStates = [
    'signUp',
    'signedIn',
    'comfirmSignIn',
    'confirmSignUp',
    'forgotPassword',
    'verifyContact',
];

describe('sign-in', () => {
    beforeEach(() => cleanup());

    it('should be rendered correctly in the signIn, signedOut or signedUp authState', () => {
        acceptedStates.forEach(state => {
            const { asFragment } = render(
                <SignIn onStateChange={() => {}} authState={state} />,
            );
            expect(asFragment()).toMatchSnapshot();
        });
    });

    it('should render null if state is unvalid', () => {
        deniedStates.forEach(state => {
            const { asFragment } = render(
                <SignIn onStateChange={() => {}} authState={state} />,
            );
            expect(asFragment()).toMatchSnapshot();
        });
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

        const emailInput = getByLabelText('Email Address', {
            exact: false,
            selector: 'input',
        });
        fireEvent.change(emailInput, { target: { value: 'test@test.de' } });

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
