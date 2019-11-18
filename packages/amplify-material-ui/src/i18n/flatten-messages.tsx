import { RawIntlMessages, IntlMessages } from './types';

export const flattenMessages = (
  nestedMessages: RawIntlMessages,
  prefix = ''
): IntlMessages =>
  Object.keys(nestedMessages).reduce(
    (messages: Record<string, string>, key: string) => {
      const value = nestedMessages[key];
      const prefixedKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'string') {
        messages[prefixedKey] = value;
      } else {
        Object.assign(messages, flattenMessages(value, prefixedKey));
      }

      return messages;
    },
    {}
  );
