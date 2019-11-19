import * as React from 'react';

export interface NotificationState {
  content: string;
  variant: 'success' | 'warning' | 'error' | 'info';
}

export interface NotificationContextProps {
  showNotification: (notificationState: NotificationState) => void;
  clearNotification: () => void;
  notification: NotificationState | null;
}

function createNamedContext<T>(
  name: string,
  defaultValue: T
): React.Context<T> {
  const context = React.createContext<T>(defaultValue);
  context.displayName = name;

  return context;
}

export const NotificationContext = createNamedContext<NotificationContextProps | null>(
  'Notification',
  null
);

export const useNotificationContext = (): NotificationContextProps =>
  React.useContext(NotificationContext) as NotificationContextProps;
