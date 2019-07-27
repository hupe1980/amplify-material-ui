import * as React from 'react';
import {
    createStyles,
    makeStyles,
    TextField,
    Theme,
    Grid,
    Link,
} from '@material-ui/core';
import Auth from '@aws-amplify/auth';
import { ConsoleLogger as Logger, I18n, JS } from '@aws-amplify/core';

import { AuthProps } from './auth-props';
import { FormSection, SectionHeader, SectionBody, SectionFooter } from '../ui';

import { useForm } from '../hooks';

const logger = new Logger('RequireNewPassword');

export interface RequireNewPasswordProps extends AuthProps {}

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

export const RequireNewPassword: React.FC<RequireNewPasswordProps> = props => {
    const { authState, onStateChange } = props;

    const classes = useStyles();

    const submit = (inputs: any) => {
        const user = props.authData;
        const { password } = inputs;
        //const { requiredAttributes } = user.challengeParam;
        //const attrs = objectWithProperties(this.inputs, requiredAttributes);

        if (!Auth || typeof Auth.completeNewPassword !== 'function') {
            throw new Error(
                'No Auth module found, please ensure @aws-amplify/auth is imported',
            );
        }
        Auth.completeNewPassword(user, password, undefined)
            .then(user => {
                logger.debug('complete new password', user);
                if (user.challengeName === 'SMS_MFA') {
                    onStateChange('confirmSignIn', user);
                } else if (user.challengeName === 'MFA_SETUP') {
                    logger.debug('TOTP setup', user.challengeParam);
                    onStateChange('TOTPSetup', user);
                } else {
                    onStateChange(user);
                }
            })
            .catch(err => console.log(err) /*this.error(err)*/);
    };

    const { inputs, handleInputChange, handleSubmit } = useForm(submit, {
        password: '',
    });

    if (!['requireNewPassword'].includes(authState)) {
        return null;
    }

    return (
        <FormSection>
            <SectionHeader>{I18n.get('Change Password')}</SectionHeader>
            <form onSubmit={handleSubmit} className={classes.form} noValidate>
                <SectionBody>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label={I18n.get('New Password')}
                        type="password"
                        id="password"
                        onChange={handleInputChange}
                        value={inputs.password}
                    />
                </SectionBody>
                <SectionFooter>
                    <Grid container>
                        <Grid item>
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
