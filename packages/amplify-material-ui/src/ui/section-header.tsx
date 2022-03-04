import * as React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Theme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import { useOverrides } from './override-provider';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  }),
);

export const SectionHeader: React.FC = ({ children }) => {
  const classes = useStyles();

  const { logo } = useOverrides();

  const renderLogo = logo || (
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
  )

  return (
    <Box className={classes.box}>
      {renderLogo}
      <Typography component="h1" variant="h6">
        {children}
      </Typography>
    </Box>
  );
};
