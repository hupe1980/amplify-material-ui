import * as React from 'react';
import { IntlProvider as Intl } from 'react-intl';
import { lookup, navigatorLanguages } from 'langtag-utils';

import { flattenMessages } from './flatten-messages';
import { mergeDeep } from './merge-deep';
import { RawIntlMessages, IntlMessages } from './types';

const DEFAULT_LOCAL = 'en';

const defaultMessages: RawIntlMessages = {
  de: {
    global: {
      labels: {
        password: 'Passwort',
        newPassword: 'Neues Passwort',
        username: 'Benutzername',
        email: 'Email',
        phoneNumber: 'Telefonnummer',
        code: 'Code',
        confirmationCode: 'Bestätigungs-Code',
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
        backToSignIn: 'Zurück zur Anmeldung',
        forgotPassword: 'Passwort zurücksetzen',
        signUp: 'Hier registrieren',
      },
    },
    verifyContact: {
      header: 'Zurücksetzen des Account benötigt einen verifizierten Account',
      buttons: {
        submit: 'Abschicken',
        verify: 'Verifizieren',
      },
      links: {
        skip: 'Überspringen',
      },
    },
    requireNewPassword: {
      header: 'Passwort ändern',
      buttons: {
        change: 'Ändern',
      },
      links: {
        backToSignIn: 'Zurück zur Anmeldung',
      },
    },
    confirmSignIn: {
      header: '{mfaType} Code bestätigen',
      buttons: {
        confirm: 'Bestätigen',
      },
      links: {
        backToSignIn: 'Zurück zur Anmeldung',
      },
    },
    confirmSignUp: {
      header: 'Zurücksetzen des Passworts',
      buttons: {
        confirm: 'Bestätigen',
      },
      links: {
        resendCode: 'Code erneut senden',
        backToSignIn: 'Zurück zur Anmeldung',
      },
    },
    forgotPassword: {
      header: 'Zurücksetzen des Passworts',
      buttons: {
        submit: 'Abschicken',
        sendCode: 'Code senden',
      },
      links: {
        resendCode: 'Code erneut senden',
        backToSignIn: 'Zurück zur Anmeldung',
      },
    },
    totpSetup: {
      header: '',
      labels: {
        totpCode: '',
      },
      buttons: {
        verifyTotpToken: '',
      },
    },
    greetings: {
      menu: {
        signedIn: 'Angemeldet als {username}',
        logout: 'Logout',
      },
    },
  },
};

export interface IntlProviderProps {
  supportedLocales?: string[];
  customMessages?: RawIntlMessages;
}

export const IntlProvider: React.FC<IntlProviderProps> = ({
  supportedLocales = [DEFAULT_LOCAL, 'de'],
  customMessages = {},
  children,
}) => {
  const detectedLocale = lookup(
    supportedLocales,
    navigatorLanguages(),
    DEFAULT_LOCAL
  );

  const createMessages = (): IntlMessages | undefined => {
    const mergedMessages = defaultMessages[detectedLocale]
      ? mergeDeep(
          defaultMessages[detectedLocale],
          customMessages[detectedLocale]
        )
      : customMessages[detectedLocale];

    return mergedMessages ? flattenMessages(mergedMessages) : undefined;
  };

  const messages = createMessages();

  return (
    <Intl
      locale={detectedLocale}
      key={detectedLocale}
      messages={messages}
      defaultLocale={DEFAULT_LOCAL}
    >
      {children}
    </Intl>
  );
};
