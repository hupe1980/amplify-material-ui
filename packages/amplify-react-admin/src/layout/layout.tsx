import React from 'react';
import { Notification, LayoutProps } from 'react-admin';
import { makeStyles } from '@material-ui/core';

import { Header } from './header';
import { Main } from './main';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100vh',
    },
}));

export const Layout: React.FC<LayoutProps> = ({ children, dashboard }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Header title="AmplifyReactAdmin" hasDashboard={!!dashboard} />
            <Main>{children}</Main>
            <Notification />
        </div>
    );
};
