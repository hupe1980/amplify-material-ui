import * as React from 'react';
import { Container } from '@material-ui/core';

const FormContainer: React.FC = ({ children }) => {
    return <Container maxWidth="xs">{children}</Container>;
};

export default FormContainer;
