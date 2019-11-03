import * as React from 'react';
import { render } from '@testing-library/react';
import { Toast } from '../toast';

describe('loading', () => {
    it('should be rendered correctly (error)', () => {
        const { asFragment } = render(
            <Toast message="Error" variant="error" />,
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('should be rendered correctly (info)', () => {
        const { asFragment } = render(<Toast message="Info" variant="info" />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should be rendered correctly (warning)', () => {
        const { asFragment } = render(
            <Toast message="Warning" variant="warning" />,
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('should be rendered correctly (success)', () => {
        const { asFragment } = render(
            <Toast message="Success" variant="success" />,
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
