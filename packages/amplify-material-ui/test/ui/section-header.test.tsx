import * as React from 'react';
import { render } from '@testing-library/react';
import { SectionHeader } from '../../src';
import { withTheme } from '../helpers/withTheme';

describe('section-header', () => {
  it('should be rendered correctly', () => {
    const { asFragment } = render(
      withTheme(
        <SectionHeader>
          <div />
        </SectionHeader>,
      )
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
