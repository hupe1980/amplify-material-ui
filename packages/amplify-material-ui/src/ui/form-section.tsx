import * as React from 'react';
import { Paper } from '@mui/material';
import { Theme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';

import { FormContainer } from './form-container';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(12),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minWidth: '300px',
      padding: theme.spacing(1),
    },
  }),
);

export const FormSection: React.FC = ({ children }) => {
  const classes = useStyles();

  return (
    <FormContainer>
      <Paper className={classes.paper}>{children}</Paper>
    </FormContainer>
  );
};
