import * as React from 'react';
import { render, cleanup } from '@testing-library/react';
import SignIn from '../sign-in';

const acceptedStates = ['signIn', 'signedUp', 'signedOut'];

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
        const { asFragment } = render(
            <SignIn onStateChange={() => {}} authState="UNVALID_STATE" />,
        );

        expect(asFragment()).toMatchSnapshot();
    });
});
