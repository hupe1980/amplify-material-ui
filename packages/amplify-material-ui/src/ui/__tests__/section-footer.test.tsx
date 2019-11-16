import * as React from 'react';
import { render } from '@testing-library/react';
import { SectionFooter } from '../section-footer';

describe('section-footer', () => {
    it('should be rendered correctly', () => {
        const { asFragment } = render(
            <SectionFooter>
                <div />
            </SectionFooter>,
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
