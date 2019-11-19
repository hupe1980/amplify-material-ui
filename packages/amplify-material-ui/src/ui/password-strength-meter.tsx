import * as React from 'react';
import clsx from 'clsx';
import zxcvbn from 'zxcvbn';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import grey from '@material-ui/core/colors/grey';
import yellow from '@material-ui/core/colors/yellow';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import { makeStyles, Theme } from '@material-ui/core/styles';

export type ScoreLabel = 'weak' | 'fair' | 'good' | 'strong';

const mapScoreLabel = (score: number): ScoreLabel => {
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

const useStyles = makeStyles((theme: Theme) => ({
  progress: {
    backgroundColor: grey[300],
    height: '8px',
  },
  weak: {
    backgroundColor: theme.palette.error.dark,
  },
  fair: {
    backgroundColor: yellow[500],
  },
  good: {
    backgroundColor: blue[500],
  },
  strong: {
    backgroundColor: green[500],
  },
}));

export interface PasswordStrengthMeterProps {
  className?: string;
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = props => {
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
