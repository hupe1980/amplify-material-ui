import * as React from 'react';
import { render } from '@testing-library/react';

import { SignUp } from '../sign-up';
import { withContext } from './helper';

describe('sign-up', () => {
    it('should be rendered correctly', () => {
        const { asFragment } = render(withContext(<SignUp />)());
        expect(asFragment()).toMatchSnapshot();
    });
});
