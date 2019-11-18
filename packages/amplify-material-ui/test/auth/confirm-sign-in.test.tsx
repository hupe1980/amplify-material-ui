import * as React from 'react';
import { render } from '@testing-library/react';

import { withContext } from './helper';
import { ConfirmSignIn } from '../../src';

describe('confirm-sign-in', () => {
  it('should be rendered correctly in the confirmSignIn authState', () => {
    const { asFragment } = render(withContext(<ConfirmSignIn />)());
    expect(asFragment()).toMatchSnapshot();
  });
});
