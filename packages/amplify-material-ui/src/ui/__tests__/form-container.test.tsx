import * as React from 'react';
import { render } from '@testing-library/react';
import { FormContainer } from '../form-container';

describe('form-container', () => {
    it('should be rendered correctly', () => {
        const { asFragment } = render(
            <FormContainer>
                <div />
            </FormContainer>,
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
