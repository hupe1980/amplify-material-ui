import * as React from 'react';
import { render } from '@testing-library/react';

import { SignUp } from '../../src';
import { withContext } from './helper';

describe('sign-up', () => {
  it('should be rendered correctly', () => {
    const { asFragment } = render(withContext(<SignUp />)());
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render custom sign-up fields', () => {
    const signUpConfig = {
      signUpFields: [
        {
          label: 'First name',
          key: 'given_name',
          required: true,
          displayOrder: 1,
          type: 'text',
        },
        {
          label: 'Surname',
          key: 'family_name',
          required: true,
          displayOrder: 2,
          type: 'text',
        },
        {
          label: 'Email',
          key: 'email',
          required: true,
          displayOrder: 3,
          type: 'email',
        },
        {
          label: 'Password',
          key: 'password',
          required: true,
          displayOrder: 4,
          type: 'password',
        },
      ],
    };

    const { asFragment } = render(
      withContext(<SignUp signUpConfig={signUpConfig} />)()
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render custom sign-up fields in the correct order', () => {
    const signUpConfig = {
      signUpFields: [
        {
          label: 'Password',
          key: 'password',
          required: true,
          displayOrder: 4,
          type: 'password',
        },
        {
          label: 'Email',
          key: 'email',
          required: true,
          displayOrder: 3,
          type: 'email',
        },
        {
          label: 'Surname',
          key: 'family_name',
          required: true,
          displayOrder: 2,
          type: 'text',
        },
        {
          label: 'First name',
          key: 'given_name',
          required: true,
          displayOrder: 1,
          type: 'text',
        },
      ],
    };

    const { asFragment } = render(
      withContext(<SignUp signUpConfig={signUpConfig} />)()
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should allow custom initial values', () => {
    const signUpConfig = {
      initialValues: {
        username: 'username initial value',
        email: 'email@example.com',
        password: 'extremelysecurepassword1!',
      },
    };

    const { asFragment } = render(
      withContext(<SignUp signUpConfig={signUpConfig} />)()
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
