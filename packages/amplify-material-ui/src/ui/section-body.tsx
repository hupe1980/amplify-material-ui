import * as React from 'react';
import { Box } from '@mui/material';
import { Theme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    box: {},
  }),
);

export const SectionBody: React.FC = ({ children }) => {
  const classes = useStyles();

  return <Box className={classes.box}>{children}</Box>;
};
