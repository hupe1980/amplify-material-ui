import * as React from 'react';

import { Toast } from '../ui';
import { useNotificationContext } from './use-notification-context';

export interface NotificationProps {
  autoHideDuration?: number;
  className?: string;
}

export const Notification: React.FC<NotificationProps> = ({
  autoHideDuration,
  className,
}) => {
  const { notification, clearNotification } = useNotificationContext();

  const handleClose = (
    _event?: React.SyntheticEvent,
    reason?: string
  ): void => {
    if (reason === 'clickaway') {
      return;
    }
    clearNotification();
  };

  return (
    <Toast
      autoHideDuration={autoHideDuration}
      className={className}
      {...notification}
      open={!!notification}
      onClose={handleClose}
    />
  );
};
