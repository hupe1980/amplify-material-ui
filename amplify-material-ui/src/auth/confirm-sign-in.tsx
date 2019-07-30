import * as React from 'react';
import invariant from 'tiny-invariant';
import {
    Button,
    Grid,
    Link,
    TextField,
    makeStyles,
    createStyles,
    Theme,
} from '@material-ui/core';
import Auth from '@aws-amplify/auth';
import { I18n } from '@aws-amplify/core';

import { FormSection, SectionHeader, SectionBody, SectionFooter } from '../ui';
import { useForm } from '../hooks';

import { AuthComponent, AuthProps } from './types';

export interface ConfirmSignInProps extends AuthProps {
    validationData?: { [key: string]: string };
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        form: {
            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(1),
        },
        submit: {
            margin: theme.spacing(3, 0, 2),
        },
    }),
);

const useMfaType = (user: any) => {
    const [mfaType, setMfaType] = React.useState('SMS');

    React.useEffect(() => {
        const newMfaType =
            user && user.challengeName === 'SOFTWARE_TOKEN_MFA'
                ? 'TOTP'
                : 'SMS';
        if (mfaType !== newMfaType) {
            setMfaType(newMfaType);
        }
    }, [mfaType, user]);

    return mfaType;
};

export const ConfirmSignIn: AuthComponent<ConfirmSignInProps> = props => {
    const { onStateChange, authData: user } = props;

    const classes = useStyles();

    const mfaType = useMfaType(user);

    const confirm = async ({ code }: { code: string }) => {
        invariant(
            Auth && typeof Auth.confirmSignIn === 'function',
            'No Auth module found, please ensure @aws-amplify/auth is imported',
        );

        await Auth.confirmSignIn(
            user,
            code,
            mfaType === 'TOTP' ? 'SOFTWARE_TOKEN_MFA' : null,
        );
    };

    const { inputs, handleInputChange, handleSubmit } = useForm(confirm, {
        code: '',
    });

    return (
        <FormSection>
            <SectionHeader>
                {I18n.get('Confirm ' + mfaType + ' Code')}
            </SectionHeader>
            <form onSubmit={handleSubmit} className={classes.form} noValidate>
                <SectionBody>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="code"
                        label={`${I18n.get('Code')} *`}
                        name="code"
                        autoComplete="code"
                        autoFocus
                        onChange={handleInputChange}
                        value={inputs.code}
                    />
                </SectionBody>
                <SectionFooter>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        {I18n.get('Confirm')}
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link
                                href="#"
                                onClick={() => onStateChange('signIn', null)}
                                variant="body2"
                            >
                                {I18n.get('Back to Sign In')}
                            </Link>
                        </Grid>
                    </Grid>
                </SectionFooter>
            </form>
        </FormSection>
    );
};
