import * as React from 'react';
import { render } from '@testing-library/react';
import { PasswordField } from '../password-field';

describe('loading', () => {
    it('should be rendered correctly', () => {
        const { asFragment } = render(<PasswordField />);
        expect(asFragment()).toMatchSnapshot();
    });
});
