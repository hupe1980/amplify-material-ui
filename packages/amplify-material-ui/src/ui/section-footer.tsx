import * as React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    box: {},
  })
);

export const SectionFooter: React.FC = ({ children }) => {
  const classes = useStyles();

  return <Box className={classes.box}>{children}</Box>;
};
