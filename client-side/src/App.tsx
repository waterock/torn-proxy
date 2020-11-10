import React, { useEffect, useState } from 'react';
import styles from './App.module.scss';
import TornKeyForm from './TornKeyForm';
import ProxyKeys from './ProxyKeys';
import AppContext, { AppContextInterface } from './AppContext';
import Faq from './Faq';
import User from './interfaces/User';

function App() {
    const [user, setUser] = useState<User | null>(null);

    const appContextValue: AppContextInterface = {
        serverBaseUrl: process.env.REACT_APP_SERVER_BASE_URL!,
        user,
    };

    useEffect(() => {
        // Make a request that responds with a 200 only if the http-only jwt is still valid.
        (async () => {
            const response = await fetch(appContextValue.serverBaseUrl + '/api/me', { credentials: 'include' });
            if (response.status === 200) {
                const me: User = await response.json();
                setUser(me);
            }
        })();
    }, []);

    const lock = () => {
        setUser(null);
        fetch(appContextValue.serverBaseUrl + '/api/lock', { credentials: 'include', method: 'post' });
    };

    return (
        <AppContext.Provider value={appContextValue}>
            <div className={styles.root}>
                <h1>TORN proxy</h1>
                <p>The only place that needs to know your TORN API key.</p>
                <p>Apps can use dedicated proxy keys to make requests to the TORN API.</p>
                <p>Easy app-based access control for added privacy and security.</p>

                <h2>My proxy keys</h2>
                {user === null && (
                    <>
                        <p>Locked. Enter your TORN API key first.</p>
                        <TornKeyForm onAuthenticated={setUser}/>
                    </>
                )}
                {user !== null && <ProxyKeys onLock={lock}/>}

                {user === null && (
                    <>
                        <h2>We have a problem</h2>
                        <Faq question="What's going on?">
                            Please use default TORN keys instead of proxy keys. We can't guarantee continued service because of TORN's API limits, mostly the IP-based one. Need more control? Then bug Ched until he finally gives in. Or <a href="https://www.torn.com/forums.php#/p=threads&f=4&t=16123202" target="_blank" rel="noopener">vote and bump this</a>
                        </Faq>
                    </>
                )}
            </div>
        </AppContext.Provider>
    );
}

export default App;
