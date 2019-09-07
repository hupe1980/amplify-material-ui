import { I18n } from '@aws-amplify/core';

import dict from './dict';

export * from './auth';

I18n.putVocabularies(dict);
