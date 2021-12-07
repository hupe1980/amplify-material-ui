import * as React from 'react';
import { render } from '@testing-library/react';

jest.mock('react-recaptcha-hook', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...(jest.requireActual('react-recaptcha-hook') as any),
  useRecaptcha: () => () => jest.fn().mockResolvedValue('token'),
}));

import { Recaptcha } from '../../src';

describe('recaptcha', () => {
  it('should be rendered correctly', () => {
    const { asFragment } = render(<Recaptcha sitekey="KEY" action="ACTION" onToken={(): void => { }} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
