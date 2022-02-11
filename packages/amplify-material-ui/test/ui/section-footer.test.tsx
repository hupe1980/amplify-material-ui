import * as React from 'react';
import { render } from '@testing-library/react';
import { SectionFooter } from '../../src';
import { withTheme } from '../helpers/withTheme';

describe('section-footer', () => {
  it('should be rendered correctly', () => {
    const { asFragment } = render(
      withTheme(
        <SectionFooter>
          <div />
        </SectionFooter>,
      )
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
