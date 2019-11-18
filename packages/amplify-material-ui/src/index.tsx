import { I18n } from '@aws-amplify/core';

import dict from './dict';

export * from './auth';
export * from './ui';
export * from './i18n';

I18n.putVocabularies(dict);
