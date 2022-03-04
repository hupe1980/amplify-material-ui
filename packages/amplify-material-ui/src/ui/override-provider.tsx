import * as React from 'react';

export interface OverrideComponents {
  logo?: JSX.Element
}

const OverrideContext = React.createContext<OverrideComponents>({})

export const useOverrides = () => React.useContext(OverrideContext) || {}

export const OverrideProvider: React.FC<OverrideComponents> = ({children, ...props}) => {
  return (
    <OverrideContext.Provider value={props}>
      {children}
    </OverrideContext.Provider>
  )
};
