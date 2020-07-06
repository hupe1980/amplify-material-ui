import * as React from 'react';
import { useRecaptcha, Badge } from 'react-recaptcha-hook';

export interface RecaptchaProps {
  sitekey: string;
  action: string;
  onToken: Function;
}

export const Recaptcha: React.FC<RecaptchaProps> = (props) => {
  const { sitekey, action, onToken } = props;
  const execute = useRecaptcha({ sitekey, hideDefaultBadge: true });

  React.useEffect(() => {
    const getToken = async (): Promise<void> => {
      const token = await execute(action);
      onToken(token);
    };

    getToken();
  }, [action, execute, onToken]);

  return <Badge />;
};
