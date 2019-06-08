import React from 'react';
import requireContext from 'require-context.macro';
import { configure } from '@storybook/react';
import { addDecorator } from '@storybook/react';
import { CssBaseline, createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

addDecorator(storyFn => (
    <ThemeProvider theme={createMuiTheme()}>
        <CssBaseline />
        {storyFn()}
    </ThemeProvider>
));

// automatically import all files ending in *.stories.tsx
const req = requireContext('../src', true, /\.stories\.tsx$/);

function loadStories() {
    req.keys().forEach(req);
}

configure(loadStories, module);
