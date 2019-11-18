import * as React from 'react';
import { render } from '@testing-library/react';
import { FormSection } from '../../src';

describe('form-section', () => {
  it('should be rendered correctly', () => {
    const { asFragment } = render(
      <FormSection>
        <div />
      </FormSection>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
