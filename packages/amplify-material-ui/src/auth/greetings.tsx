import * as React from 'react';
import invariant from 'tiny-invariant';
import clsx from 'clsx';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    MenuItem,
    Divider,
    createStyles,
    Theme,
    makeStyles,
} from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import Auth from '@aws-amplify/auth';

import { useAuthContext } from './auth-context';

export const useSignOut = (
    global = false,
): ((global?: boolean) => Promise<void>) => {
    invariant(
        Auth && typeof Auth.signOut === 'function',
        'No Auth module found, please ensure @aws-amplify/auth is imported',
    );

    return async (): Promise<void> => Auth.signOut({ global });
};

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

export interface GreetingsProps {
    renderUserMenu?: () => React.ReactElement;
    title?: React.ReactNode;
    className?: string;
    burgerMenu?: React.ReactElement;
    globalSignOut?: boolean;
}

export const Greetings: React.FC<GreetingsProps> = props => {
    const {
        className,
        renderUserMenu,
        title = 'Greetings',
        burgerMenu,
        globalSignOut,
    } = props;

    const { authData } = useAuthContext();

    const signOut = useSignOut(globalSignOut);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const classes = useStyles();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (): void => {
        setAnchorEl(null);
    };

    const logout = async (): Promise<void> => {
        handleClose();
        await signOut();
    };

    return (
        <AppBar position="absolute" className={clsx(classes.appBar, className)}>
            <Toolbar className={classes.toolbar}>
                {burgerMenu}
                {typeof title === 'string' ? (
                    <Typography
                        component="h1"
                        variant="h6"
                        color="inherit"
                        noWrap
                        className={classes.title}
                    >
                        {title}
                    </Typography>
                ) : (
                    <div className={classes.title}>{title}</div>
                )}
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
                <MenuItem disabled>Angemeldet als {authData.username}</MenuItem>
                <Divider />
                {renderUserMenu && renderUserMenu()}
                <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
        </AppBar>
    );
};
