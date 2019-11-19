import * as React from 'react';
import Container from '@material-ui/core/Container';

export const FormContainer: React.FC = ({ children }) => {
  return <Container maxWidth="xs">{children}</Container>;
};
