import * as React from 'react';
import { Paper, createStyles, makeStyles, Theme } from '@material-ui/core';

import FormContainer from './form-container';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minWidth: '380px'
    }
  })
);

const FormSection: React.FC = ({ children }) => {
  const classes = useStyles();

  return (
    <FormContainer>
      <Paper className={classes.paper}>{children}</Paper>
    </FormContainer>
  );
};

export default FormSection;
