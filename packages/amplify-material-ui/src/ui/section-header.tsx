import * as React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Theme } from '@mui/material/styles';

import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme: Theme) =>
  ({
    box: {
      marginTop: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
  }));

export const SectionHeader: React.FC = ({ children }) => {
  const { classes } = useStyles();

  return (
    <Box className={classes.box}>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h6">
        {children}
      </Typography>
    </Box>
  );
};
