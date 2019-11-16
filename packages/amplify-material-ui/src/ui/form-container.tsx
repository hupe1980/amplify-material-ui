import * as React from 'react';
import { Container } from '@material-ui/core';

export const FormContainer: React.FC = ({ children }) => {
    return <Container maxWidth="xs">{children}</Container>;
};
