import * as React from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    MenuItem,
    createStyles,
    Theme,
    makeStyles,
} from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import Auth from '@aws-amplify/auth';

import { AuthProps } from './auth-props';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        toolbar: {
            paddingRight: 24,
        },
        title: {
            flexGrow: 1,
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
    }),
);

export interface GreetingsProps extends AuthProps {}

export const Greetings: React.FC<GreetingsProps> = props => {
    const { authState } = props;

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const classes = useStyles();

    if (!['signedIn'].includes(authState)) {
        return null;
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logout = async () => {
        await Auth.signOut();
        handleClose();
    };

    return (
        <AppBar position="absolute" className={classes.appBar}>
            <Toolbar className={classes.toolbar}>
                <Typography
                    component="h1"
                    variant="h6"
                    color="inherit"
                    noWrap
                    className={classes.title}
                >
                    Greetings
                </Typography>
                <IconButton
                    color="inherit"
                    aria-controls="user-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <AccountCircle />
                </IconButton>
            </Toolbar>
            <Menu
                id="user-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
        </AppBar>
    );
};
