# amplify-material-ui

> A [Material-UI](https://github.com/mui-org/material-ui) based implementation of [aws amplify](https://github.com/aws-amplify/amplify-js)

:warning: This is experimental and subject to breaking changes.

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

## Customize initial authState

You can change the initial auth state for your Authenticator. By default the initial state is signIn which will shows the signIn component.

```typescript
withAuthenticator(App, {
    initialAuthState: 'signUp',
});
```

## License

[MIT](LICENSE)
