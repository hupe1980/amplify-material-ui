import * as React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core';

import AuthProps from './auth-props';
import FormSection from '../ui/form-section';

const useStyles = makeStyles((theme: Theme) => createStyles({}));

export interface GreetingsProps extends AuthProps {}

const Greetings: React.FC<GreetingsProps> = props => {
    const { authState } = props;

    const classes = useStyles();
    console.log(classes);

    if (!['signedIn'].includes(authState)) {
        return null;
    }

    return <FormSection>Greetings</FormSection>;
};

export default Greetings;
