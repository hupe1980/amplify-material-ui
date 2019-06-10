import * as React from 'react';
import {
    Avatar,
    Box,
    Typography,
    createStyles,
    makeStyles,
    Theme,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        box: {
            marginTop: theme.spacing(1),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        avatar: {
            margin: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main,
        },
    }),
);

const SectionHeader: React.FC = ({ children }) => {
    const classes = useStyles();

    return (
        <Box className={classes.box}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                {children}
            </Typography>
        </Box>
    );
};

export default SectionHeader;
