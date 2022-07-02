import * as React from 'react';
import { Box } from '@mui/material';
import { Theme } from '@mui/material/styles';

import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((_theme: Theme) =>
  ({
    box: {},
  }));

export const SectionBody: React.FC = ({ children }) => {
  const { classes } = useStyles();

  return <Box className={classes.box}>{children}</Box>;
};
