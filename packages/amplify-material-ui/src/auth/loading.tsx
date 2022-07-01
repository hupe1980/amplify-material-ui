import * as React from 'react';
import { CircularProgress } from '@mui/material';
import { Theme } from '@mui/material/styles';

import { makeStyles } from 'tss-react/mui';

import { FormSection } from '../ui';

const useStyles = makeStyles()((theme: Theme) =>
  ({
    progress: {
      margin: theme.spacing(2),
    },
  }));

export interface LoadingProps {
  color?: 'inherit' | 'primary' | 'secondary' | undefined;
}

export const Loading: React.FC<LoadingProps> = ({ color }) => {
  const { classes } = useStyles();

  return (
    <FormSection>
      <CircularProgress className={classes.progress} color={color} />
    </FormSection>
  );
};

Loading.defaultProps = {
  color: 'secondary',
};
