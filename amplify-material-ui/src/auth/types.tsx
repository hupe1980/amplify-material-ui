import * as React from 'react';

export interface AuthProps {
    authState: string;
    onStateChange: (authState: string, authData: any) => void;
    authData?: any;
}

export type AuthComponent<P extends Partial<AuthProps>> = React.FC<P>;
