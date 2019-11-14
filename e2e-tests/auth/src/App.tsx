import React from 'react';
import { withAuthenticator, Greetings } from 'amplify-material-ui';
import logo from './logo.svg';
import './App.css';

const App: React.FC = () => (
    <>
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
    </>
);

export default withAuthenticator(App, {
    hide: [Greetings],
    hideSignUpLink: true,
    //hideForgotPasswordLink: true,
    //initialAuthState: 'signUp',
});
