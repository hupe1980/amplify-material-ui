import * as React from 'react';
import { render } from '@testing-library/react';
import { Recaptcha } from '../Recaptcha';

describe('recaptcha', () => {
    it('should be rendered correctly', () => {
        const { asFragment } = render(
            <Recaptcha sitekey="KEY" action="ACTION" onToken={() => {}} />,
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
