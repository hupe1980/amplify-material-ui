# amplify-material-ui

> A [Material-UI](https://github.com/mui-org/material-ui) based implementation of [aws amplify](https://github.com/aws-amplify/amplify-js)

## Install

```sh
// with npm
npm install amplify-material-ui

// with yarn
yarn add amplify-material-ui
```

## How to use

```typescript
import React from 'react';
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'amplify-material-ui';

import awsconfig from './aws-exports';
import logo from './logo.svg';
import './App.css';

Amplify.configure(awsconfig);

const App: React.FC = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </header>
  </div>
);

export default withAuthenticator(App);
```

## Hide default components

You can hide default components of your Authenticator.

```typescript
withAuthenticator(App, {
  hide: [Greetings],
});
```

## Hide links in default components

You can disable sign up if you do not allow users to sign up themselves.

```typescript
withAuthenticator(App, {
  hide: [SignUp],
  hideSignUpLink: true,
  //hideForgotPasswordLink: true,
});
```

## Customize initial authState

You can change the initial auth state for your Authenticator. By default the initial state is signIn which will shows the signIn component.

```typescript
withAuthenticator(App, {
  initialAuthState: 'signUp',
});
```


## Localization

amplify-material-ui is built with [react-intl](https://formatjs.io/docs/getting-started/installation/) support. You can add your own localized strings translations by passing the intlProps into the authenticator.

```typescript
withAuthenticator(App, {
  intlProps: {
    customMessages: {
      de: {
        global: {
          labels: {
            username: 'Overwrite username label',
          },
        },
      },
    },
  },
});
```


## Customize sign-up form

You can customize the sign-up fields as well as the initial values passed into the form:

```typescript
const signUpConfig = {
  signUpFields: [
    {
      label: 'First name',
      key: 'given_name',
      required: true,
      displayOrder: 1,
      type: 'text',
      intl: {
        label: 'signUp.labels.family_name',
      }
    },
    {
      label: 'Surname',
      key: 'family_name',
      required: true,
      displayOrder: 2,
      type: 'text',
      intl: {
        label: 'signUp.labels.given_name',
      }
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
  initialValues: {
    given_name: 'John',
    family_name: 'Smith',
  },
};

withAuthenticator(App, {
  signUpConfig,
  intlProps: {
    customMessages: {
      de: {
        signUp: {
          labels: {
            given_name: 'Translated given name',
            family_name: 'Translated family name',
          },
        },
      },
    },
  },
});

```

## Customize sign-up fields

## License

[MIT](LICENSE)
