import React from 'react';
import ReactDOM from 'react-dom';
import Amplify from 'aws-amplify';

import App from './App';

Amplify.configure({
  Auth: {
    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,

    // REQUIRED - Amazon Cognito Region
    region: process.env.REACT_APP_REGION,

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: process.env.REACT_APP_USER_POOL_ID,

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID,
  },
});

ReactDOM.render(<App />, document.getElementById('root'));
