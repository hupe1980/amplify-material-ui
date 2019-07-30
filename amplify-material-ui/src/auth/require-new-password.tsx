import * as React from 'react';
import invariant from 'tiny-invariant';
import {
    createStyles,
    Button,
    makeStyles,
    TextField,
    Theme,
    Grid,
    Link,
} from '@material-ui/core';
import Auth from '@aws-amplify/auth';
import { ConsoleLogger as Logger, I18n, JS } from '@aws-amplify/core';

import { FormSection, SectionHeader, SectionBody, SectionFooter } from '../ui';

import { useForm } from '../hooks';

import { AuthComponent, AuthProps } from './types';

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

export const RequireNewPassword: AuthComponent<
    RequireNewPasswordProps
> = props => {
    const { onStateChange } = props;

    const classes = useStyles();

    const checkContact = async (user: any) => {
        invariant(
            Auth && typeof Auth.verifiedContact === 'function',
            'No Auth module found, please ensure @aws-amplify/auth is imported',
        );

        const data = await Auth.verifiedContact(user);

        if (!JS.isEmpty(data.verified)) {
            onStateChange('signedIn', user);
        } else {
            user = Object.assign(user, data);
            onStateChange('verifyContact', user);
        }
    };

    const submit = async (inputs: any) => {
        const user = props.authData;
        const { password } = inputs;
        //const { requiredAttributes } = user.challengeParam;
        //const attrs = objectWithProperties(this.inputs, requiredAttributes);

        if (!Auth || typeof Auth.completeNewPassword !== 'function') {
            throw new Error(
                'No Auth module found, please ensure @aws-amplify/auth is imported',
            );
        }
        try {
            const updatedUser = await Auth.completeNewPassword(
                user,
                password,
                undefined,
            );

            logger.debug('complete new password', updatedUser);

            if (updatedUser.challengeName === 'SMS_MFA') {
                onStateChange('confirmSignIn', updatedUser);
            } else if (updatedUser.challengeName === 'MFA_SETUP') {
                logger.debug('TOTP setup', updatedUser.challengeParam);
                onStateChange('TOTPSetup', updatedUser);
            } else {
                checkContact(updatedUser);
            }
        } catch (error) {
            console.log(error); /*this.error(err)*/
        }
    };

    const { inputs, handleInputChange, handleSubmit } = useForm(submit, {
        password: '',
    });

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
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        {I18n.get('Change')}
                    </Button>
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
