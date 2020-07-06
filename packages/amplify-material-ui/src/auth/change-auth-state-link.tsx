import * as React from 'react';
import Link from '@material-ui/core/Link';
import { AuthData, useAuthContext } from 'amplify-auth-hooks';

export interface ChangeAuthStateLinkProps {
  label: string;
  newState: string;
  authData?: AuthData;
  [key: string]: any;
}

export const ChangeAuthStateLink: React.FC<ChangeAuthStateLinkProps> = (
  props
) => {
  const { label, newState, authData, ...rest } = props;

  const { handleStateChange } = useAuthContext();

  return (
    <Link
      href="#"
      onClick={(): void => handleStateChange(newState, authData)}
      variant="body2"
      {...rest}
    >
      {label}
    </Link>
  );
};
