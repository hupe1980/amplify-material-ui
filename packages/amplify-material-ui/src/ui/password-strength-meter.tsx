import * as React from 'react';
import clsx from 'clsx';
import zxcvbn from 'zxcvbn';
import { Typography, LinearProgress, colors } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
    progress: {
        backgroundColor: colors.grey[300],
        height: '8px',
    },
    weak: {
        backgroundColor: theme.palette.error.dark,
    },
    fair: {
        backgroundColor: colors.yellow[500],
    },
    good: {
        backgroundColor: colors.blue[500],
    },
    strong: {
        backgroundColor: colors.green[500],
    },
}));

const mapScoreLabel = (score: number) => {
    switch (score) {
        case 0:
            return 'weak';
        case 1:
            return 'weak';
        case 2:
            return 'fair';
        case 3:
            return 'good';
        case 4:
            return 'strong';
        default:
            return 'weak';
    }
};

export interface PasswordStrengthMeterProps {
    className?: string;
    password: string;
}

export const PasswordStrengthMeter: React.FC<
    PasswordStrengthMeterProps
> = props => {
    const { className, password } = props;

    const classes = useStyles();

    const { score } = zxcvbn(password);

    const scoreLabel = mapScoreLabel(score);

    return (
        <>
            <LinearProgress
                className={clsx(classes.progress, className)}
                classes={{ barColorPrimary: classes[scoreLabel] }}
                variant="determinate"
                value={100 / (4 / score)}
            />
            <Typography>Password strength: {scoreLabel}</Typography>
        </>
    );
};
