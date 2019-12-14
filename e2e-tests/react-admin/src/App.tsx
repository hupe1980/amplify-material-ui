import React from 'react';
import { Admin, Resource } from 'amplify-react-admin';
import fakeDataProvider from 'ra-data-fakerest';

import posts from './posts';

const dataProvider = fakeDataProvider({
  posts: [
    { id: 0, title: 'Hello, world!' },
    { id: 1, title: 'FooBar' },
  ],
  comments: [
    { id: 0, postId: 0, author: 'John Doe', body: 'Sensational!' },
    { id: 1, postId: 0, author: 'Jane Doe', body: 'I agree' },
  ],
});

const App: React.FC = () => (
  <>
    <React.StrictMode>
      <Admin dataProvider={dataProvider}>
        <Resource name="posts" {...posts} />
      </Admin>
    </React.StrictMode>
  </>
);

export default App;
