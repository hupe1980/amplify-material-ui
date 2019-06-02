import React from 'react';
import { configure } from '@storybook/react';
import { addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { CssBaseline, createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

addDecorator(
  withInfo({
    inline: true,
    source: true
  })
);

addDecorator(storyFn => (
  <ThemeProvider theme={createMuiTheme()}>
    <CssBaseline />
    {storyFn()}
  </ThemeProvider>
));

// automatically import all files ending in *.stories.tsx
const req = require.context('../src', true, /\.stories\.tsx$/);

function loadStories() {
  req.keys().forEach(req);
}

configure(loadStories, module);
