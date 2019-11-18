import * as React from 'react';
import { render } from '@testing-library/react';

import { ForgotPassword } from '../../src';
import { withContext } from './helper';

describe('forgot-password', () => {
  it('should be rendered correctly', () => {
    const { asFragment } = render(withContext(<ForgotPassword />)());
    expect(asFragment()).toMatchSnapshot();
  });
});
