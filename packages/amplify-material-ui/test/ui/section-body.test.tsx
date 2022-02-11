import * as React from 'react';
import { render } from '@testing-library/react';
import { SectionBody } from '../../src';
import { withTheme } from '../helpers/withTheme';

describe('section-body', () => {
  it('should be rendered correctly', () => {
    const { asFragment } = render(
      withTheme(
        <SectionBody>
          <div />
        </SectionBody>,
      )
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
