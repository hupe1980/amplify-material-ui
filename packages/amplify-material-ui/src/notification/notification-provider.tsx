import * as React from 'react';

import {
  NotificationState,
  NotificationContext,
} from './use-notification-context';

export interface NotificationProviderProps {
  onShowNotification?: (message: NotificationState) => NotificationState;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  onShowNotification,
}) => {
  const [
    notification,
    setNotification,
  ] = React.useState<NotificationState | null>(null);

  const showNotification = (message: NotificationState): void => {
    const msg = onShowNotification ? onShowNotification(message) : message;
    setNotification(msg);
  };

  const clearNotification = (): void => setNotification(null);

  return (
    <NotificationContext.Provider
      value={{ showNotification, clearNotification, notification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
