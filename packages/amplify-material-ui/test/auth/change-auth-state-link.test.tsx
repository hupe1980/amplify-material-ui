import * as React from 'react';
import { render } from '@testing-library/react';

import { withContext } from './helper';
import { ChangeAuthStateLink } from '../../src';

describe('change-auth-state-link', () => {
  it('should be rendered correctly', () => {
    const { asFragment } = render(
      withContext(
        <ChangeAuthStateLink label="LinkLabel" newState="newState" />
      )()
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
