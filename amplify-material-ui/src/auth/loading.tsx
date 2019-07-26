import * as React from 'react';
import {
    createStyles,
    Theme,
    makeStyles,
    CircularProgress,
} from '@material-ui/core';

import AuthProps from './auth-props';
import FormSection from '../ui/form-section';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        progress: {
            margin: theme.spacing(2),
        },
    }),
);

export interface LoadingProps extends AuthProps {
    color?: 'inherit' | 'primary' | 'secondary' | undefined;
}

export const Loading: React.FC<LoadingProps> = props => {
    const { authState } = props;

    const classes = useStyles();

    if (!['loading'].includes(authState)) {
        return null;
    }

    return (
        <FormSection>
            <CircularProgress className={classes.progress} />
        </FormSection>
    );
};

Loading.defaultProps = {
    color: 'secondary',
};
