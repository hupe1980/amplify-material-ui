import * as React from 'react';

import { NotificationState, NotificationContext } from './notification-context';

export const NotificationProvider: React.FC = ({ children }) => {
    const [
        notification,
        setNotification,
    ] = React.useState<NotificationState | null>(null);

    const showNotification = (message: NotificationState): void =>
        setNotification(message);

    const clearNotification = (): void => setNotification(null);

    return (
        <NotificationContext.Provider
            value={{ showNotification, clearNotification, notification }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
