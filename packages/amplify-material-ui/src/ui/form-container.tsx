import React, { ReactChild, ReactFragment, ReactPortal } from 'react';
import { Container } from '@mui/material';

export interface FormContainerProps {
  children: boolean | ReactChild | ReactFragment | ReactPortal;
}

export const FormContainer: React.FC<FormContainerProps> = ({ children }) => {
  return <Container maxWidth="xs">{children}</Container>;
};
