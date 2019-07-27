export interface AuthProps {
    authState: string;
    onStateChange: (authState: string, authData: any) => void;
}
