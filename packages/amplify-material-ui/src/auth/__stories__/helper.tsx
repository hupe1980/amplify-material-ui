import * as React from 'react';
import { AuthContext } from '../auth-context';

export const withContext = ({
    authState,
    onStateChange = () => {},
}) => component => (
    <AuthContext.Provider value={{ authState, onStateChange }}>
        {component}
    </AuthContext.Provider>
);
