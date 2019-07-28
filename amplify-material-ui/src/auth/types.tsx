import * as React from 'react';

export interface AuthProps {
    authState: string;
    onStateChange: (authState: string, authData: any) => void;
    authData?: any;
}

export interface AuthComponent<P extends Partial<AuthProps> = {}>
    extends React.FC<P> {
    validAuthStates: string[];
}
