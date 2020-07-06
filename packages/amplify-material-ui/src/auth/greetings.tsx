import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useAuthContext, useSignOut } from 'amplify-auth-hooks';
import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';

import { UsernameAttribute } from './types';

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
  })
);

export interface GreetingsProps {
  renderUserMenu?: () => React.ReactElement;
  title?: string | React.ReactElement;
  className?: string;
  burgerMenu?: React.ReactElement;
  globalSignOut?: boolean;
  usernameAttribute?: UsernameAttribute;
}

export const Greetings: React.FC<GreetingsProps> = (props) => {
  const {
    className,
    renderUserMenu,
    title = 'Greetings',
    burgerMenu,
    globalSignOut,
    usernameAttribute = UsernameAttribute.USERNAME,
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

  const getUserName = () => {
    switch (usernameAttribute) {
      case UsernameAttribute.EMAIL:
        return authData.attributes
          ? authData.attributes.email
          : authData.username;
      case UsernameAttribute.PHONE_NUMBER:
        return authData.attributes
          ? authData.attributes.phone_number
          : authData.username;
      //case UsernameAttribute.EMAIL:
      default:
        return authData.username;
    }
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
        <MenuItem disabled>
          <FormattedMessage
            id="greetings.menu.signedIn"
            defaultMessage="Signed in as {username}"
            values={{ username: getUserName() }}
          />
        </MenuItem>
        <Divider />
        {renderUserMenu && renderUserMenu()}
        <MenuItem onClick={logout}>
          <FormattedMessage
            id="greetings.menu.logout"
            defaultMessage="Logout"
          />
        </MenuItem>
      </Menu>
    </AppBar>
  );
};
