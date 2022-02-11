import * as React from 'react';
import { CircularProgress } from '@mui/material';
import { Theme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';

import { FormSection } from '../ui';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    progress: {
      margin: theme.spacing(2),
    },
  }),
);

export interface LoadingProps {
  color?: 'inherit' | 'primary' | 'secondary' | undefined;
}

export const Loading: React.FC<LoadingProps> = ({ color }) => {
  const classes = useStyles();

  return (
    <FormSection>
      <CircularProgress className={classes.progress} color={color} />
    </FormSection>
  );
};

Loading.defaultProps = {
  color: 'secondary',
};
