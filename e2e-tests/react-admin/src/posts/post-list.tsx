import * as React from 'react';

import { List, SimpleList } from 'react-admin';

export const PostList = (props) => {
  return (
    <List {...props}>
      <SimpleList
        primaryText={(record) => record.title}
        secondaryText={(record) => `${record.views} views`}
        tertiaryText={(record) =>
          new Date(record.published_at).toLocaleDateString()
        }
      />
    </List>
  );
};
