import * as React from 'react';
import { render } from '@testing-library/react';
import { FormContainer } from '../../src';
import { withTheme } from '../helpers/withTheme';

describe('form-container', () => {
  it('should be rendered correctly', () => {
    const { asFragment } = render(
      withTheme(
        <FormContainer>
          <div />
        </FormContainer>
      ),
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
