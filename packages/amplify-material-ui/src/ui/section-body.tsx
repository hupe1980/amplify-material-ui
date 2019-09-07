import * as React from 'react';
import { Box, createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        box: {},
    }),
);

const SectionBody: React.FC = ({ children }) => {
    const classes = useStyles();

    return <Box className={classes.box}>{children}</Box>;
};

export default SectionBody;
