import * as React from 'react';
import { render } from '@testing-library/react';
import { Loading } from '../../src';
import { withTheme } from '../helpers/withTheme';

describe('loading', () => {
  it('should be rendered correctly', () => {
    const { asFragment } = render(withTheme(<Loading />));
    expect(asFragment()).toMatchSnapshot();
  });
});
