import * as React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Greetings, GreetingsProps } from 'amplify-material-ui';
import {
  Divider,
  Link as MUILink,
  Hidden,
  Drawer,
  IconButton,
  makeStyles,
  Theme,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { Menu, toggleSidebar } from 'react-admin';

const useStyles = makeStyles((theme: Theme) => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: theme.drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    marginLeft: theme.drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${theme.drawerWidth}px)`,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  drawerPaper: {
    width: theme.drawerWidth,
  },
}));

export interface HeaderProps {
  title: GreetingsProps['title'];
  hasDashboard: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, hasDashboard }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const open = useSelector((state) => state.admin.ui.sidebarOpen);

  const handleDrawerToggle = () => dispatch(toggleSidebar());

  const burgerMenu = (
    <IconButton
      color="inherit"
      aria-label="open drawer"
      edge="start"
      onClick={handleDrawerToggle}
      className={classes.menuButton}
    >
      <MenuIcon />
    </IconButton>
  );

  const brand = (
    <MUILink
      variant="h6"
      underline="none"
      color="inherit"
      component={Link}
      to="/"
    >
      {title}
    </MUILink>
  );

  const drawer = (
    <>
      <div className={classes.toolbarIcon}>
        <Hidden smUp implementation="css">
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        </Hidden>
      </div>
      <Divider />
      <Menu hasDashboard={hasDashboard} />
    </>
  );

  return (
    <>
      <Greetings
        title={brand}
        className={classes.appBar}
        burgerMenu={burgerMenu}
      />
      <nav className={classes.drawer} aria-label="navigation links">
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor="left"
            open={open}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open={open}
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </>
  );
};
