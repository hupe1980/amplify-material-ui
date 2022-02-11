import * as React from 'react';
import { render } from '@testing-library/react';
import { Toast } from '../../src';
import { withTheme } from '../helpers/withTheme';

describe('loading', () => {
  it('should be rendered correctly (error)', () => {
    const { asFragment } = render(withTheme(<Toast content="Error" variant="error" open />));
    expect(asFragment()).toMatchSnapshot();
  });

  it('should be rendered correctly (info)', () => {
    const { asFragment } = render(withTheme(<Toast content="Info" variant="info" open />));
    expect(asFragment()).toMatchSnapshot();
  });

  it('should be rendered correctly (warning)', () => {
    const { asFragment } = render(withTheme(<Toast content="Warning" variant="warning" open />));
    expect(asFragment()).toMatchSnapshot();
  });

  it('should be rendered correctly (success)', () => {
    const { asFragment } = render(withTheme(<Toast content="Success" variant="success" open />));
    expect(asFragment()).toMatchSnapshot();
  });
});
