import React from 'react';
import User from '../../interfaces/User';

export interface AppContextInterface {
    serverBaseUrl: string,
    user: User | null,
}

const AppContext = React.createContext<AppContextInterface>({
    serverBaseUrl: '',
    user: null,
});

AppContext.displayName = 'AppContext';

export default AppContext;
