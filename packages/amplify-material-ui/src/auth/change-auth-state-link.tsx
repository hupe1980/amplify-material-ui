import * as React from 'react';
import { Link } from '@material-ui/core';

import { useAuthContext } from './auth-context';

export interface ChangeAuthStateLinkProps {
    label: string;
    newState: string;
    authData?: any;
}

export const ChangeAuthStateLink: React.FC<ChangeAuthStateLinkProps> = props => {
    const { label, newState, authData } = props;

    const { onStateChange } = useAuthContext();

    return (
        <Link
            href="#"
            onClick={(): void => onStateChange(newState, authData)}
            variant="body2"
        >
            {label}
        </Link>
    );
};
