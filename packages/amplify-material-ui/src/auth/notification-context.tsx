import * as React from 'react';

import { createNamedContext } from '../core';
import { ToastProps } from '../ui';

export interface NotificationState {
    content: string;
    variant: ToastProps['variant'];
}

export interface NotificationContextProps {
    showNotification: (notificationState: NotificationState) => void;
    clearNotification: () => void;
    notification: NotificationState | null;
}

export const NotificationContext = createNamedContext<NotificationContextProps | null>(
    'Notification',
    null,
);

export const useNotificationContext = (): NotificationContextProps =>
    React.useContext(NotificationContext) as NotificationContextProps;
