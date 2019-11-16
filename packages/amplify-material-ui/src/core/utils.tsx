import * as React from 'react';

export function createNamedContext<T>(
    name: string,
    defaultValue: T,
): React.Context<T> {
    const context = React.createContext<T>(defaultValue);
    context.displayName = name;

    return context;
}
