import React from 'react';
import { withAuthenticator, Greetings } from 'amplify-material-ui';
import logo from './logo.svg';
import './App.css';

const App: React.FC = () => (
  <>
    <React.StrictMode>
      <Greetings title="TITLE" />
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
        <span data-testid="firstTest">Test</span>
      </div>
    </React.StrictMode>
  </>
);

export default withAuthenticator(App, {
  hide: [Greetings],
  //hideSignUpLink: true,
  //hideSkipVerifyLink: true,
  //hideForgotPasswordLink: true,
  //initialAuthState: 'signUp',
  //title: 'TEST_TITLE',
  onStateChange: (prevState, newState) => {
    console.log('STATE_CHANGE', prevState, newState);
    return newState;
  },
  notificationProps: {
    onShowNotification: (notification) => {
      console.log(notification);
      return notification;
    },
  },
  intlProps: {
    supportedLocales: ['en, de'],
    // customMessages: {
    //   en: {
    //     signIn: {
    //       header: 'testEN',
    //       errors: {
    //         UserNotFoundException: 'TEST_EN',
    //       },
    //     },
    //   },
    //   de: {
    //     signIn: {
    //       header: 'testDE',
    //       errors: {
    //         UserNotFoundException: 'TEST_DE',
    //       },
    //     },
    //   },
    // },
  },
});
