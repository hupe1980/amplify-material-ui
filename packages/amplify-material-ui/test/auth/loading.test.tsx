import * as React from 'react';
import { render } from '@testing-library/react';
import { Loading } from '../../src';

describe('loading', () => {
  it('should be rendered correctly', () => {
    const { asFragment } = render(<Loading />);
    expect(asFragment()).toMatchSnapshot();
  });
});
