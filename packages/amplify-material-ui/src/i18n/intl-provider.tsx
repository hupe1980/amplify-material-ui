import * as React from 'react';
import { IntlProvider as Intl } from 'react-intl';
import { lookup, navigatorLanguages } from 'langtag-utils';

import { flattenMessages } from './flatten-messages';

export type IntlMessages = Record<string, any>;

const messages: IntlMessages = {
    en: {
        global: {
            labels: {
                password: 'Password',
                username: 'Username',
                email: 'Email',
                phoneNumber: 'Phone Number',
                code: 'Code',
            },
        },
        signUp: {
            header: 'Create a new account',
            buttons: {
                create: 'Create Account',
            },
            links: {
                signIn: 'Sign In',
            },
            text: {
                haveAccount: 'Have an account?',
            },
        },
        signIn: {
            header: 'Sign in to your account',
            buttons: {
                signIn: 'Sign In',
            },
            links: {
                forgotPassword: 'Reset password',
                signUp: 'Create account',
            },
        },
        verifyContact: {
            header: 'Account recovery requires verified contact information',
            buttons: {
                submit: 'Submit',
                verify: 'Verify',
            },
            links: {
                skip: 'Skip',
            },
        },
    },
    de: {
        global: {
            labels: {
                password: 'Passwort',
                username: 'Benutzername',
                email: 'Email',
                phoneNumber: 'Telefonnummer',
                code: 'Code',
            },
        },
        signUp: {
            header: 'Erstelle einen neuen Account',
            buttons: {
                create: 'Account erstellen',
            },
            links: {
                signIn: 'Anmelden',
            },
            text: {
                haveAccount: 'Schon registriert?',
            },
        },
        signIn: {
            header: 'Melden Sie sich mit Ihrem Account an',
            buttons: {
                signIn: 'Anmelden',
            },
            links: {
                forgotPassword: 'Passwort zurücksetzen',
                signUp: 'Hier registrieren',
            },
        },
        verifyContact: {
            header:
                'Zurücksetzen des Account benötigt einen verifizierten Account',
            buttons: {
                submit: 'Abschicken',
                verify: 'Verifizieren',
            },
            links: {
                skip: 'Überspringen',
            },
        },
    },
};

export interface IntlProviderProps {
    supportedLocales?: string[];
    customMessages?: IntlMessages;
}

export const IntlProvider: React.FC<IntlProviderProps> = ({
    supportedLocales = ['en', 'de'],
    customMessages = {},
    children,
}) => {
    const detectedLocale = lookup(supportedLocales, navigatorLanguages(), 'en');

    return (
        <Intl
            locale={detectedLocale}
            key={detectedLocale}
            messages={flattenMessages({
                ...messages[detectedLocale],
                ...customMessages[detectedLocale],
            })}
        >
            {children}
        </Intl>
    );
};
