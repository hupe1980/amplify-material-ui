import * as React from 'react';
import { render } from '@testing-library/react';
import { FormSection } from '../../src';
import { withTheme } from '../helpers/withTheme';

describe('form-section', () => {
  it('should be rendered correctly', () => {
    const { asFragment } = render(
      withTheme(
        <FormSection>
          <div />
        </FormSection>,
      )
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
