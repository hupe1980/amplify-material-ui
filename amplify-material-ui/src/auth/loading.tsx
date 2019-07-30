import * as React from 'react';
import {
    createStyles,
    Theme,
    makeStyles,
    CircularProgress,
} from '@material-ui/core';

import FormSection from '../ui/form-section';

import { AuthComponent, AuthProps } from './types';

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

export const Loading: AuthComponent<LoadingProps> = props => {
    const classes = useStyles();

    return (
        <FormSection>
            <CircularProgress className={classes.progress} />
        </FormSection>
    );
};

Loading.defaultProps = {
    color: 'secondary',
};
