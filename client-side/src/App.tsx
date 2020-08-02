import React, { useState } from 'react';
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
                        <h2>FAQ</h2>
                        <Faq question="Why?" answer="TORN is not going to support multiple API keys. We feel privacy should be top of mind for everyone."/>
                        <Faq question="Okay, but how?" answer="Instead of giving out your single TORN API key to apps, you create a new proxy key and use that instead. Want to stop using said app? Then simply revoke the key and the app will longer have access. No more need to reset your TORN API key."/>
                        <Faq question="Why trust you?">
                            <p>I highly value security and privacy. Ched's rejection of my <a href="https://www.torn.com/forums.php#/p=threads&f=19&t=16177140" target="_blank" rel="noopener noreferrer">[100R+] API keys suggestion</a> triggered this proxy idea. If you're an ArsonWarehouse user, I already have your TORN API key. I never have, and never will, abuse it. Better to trust a single party than a whole range of apps and sites.</p>
                        </Faq>
                        <Faq question="Okay, but what about leaks?" answer="Your TORN key is encrypted before it's stored. If the database is ever accessed by a third party, they can see your proxy keys but not your TORN key. If ever does leak I'll be transparent about it so you can take action."/>
                        <Faq question="Why are proxy keys not encrypted?" answer="To keep the proxy service as fast as possible. With every request, I need to look up the TORN key that belongs to the given proxy key and forward the request to TORN. I need to be able to efficiently query the proxy keys table."/>
                        <Faq question="Roadmap?" answer="I plan on adding permissions. Simple ones at first, separating public from private data. That way, apps can use your key to fetch market info but not sensitive data such as battle stats."/>
                    </>
                )}
            </div>
        </AppContext.Provider>
    );
}

export default App;
