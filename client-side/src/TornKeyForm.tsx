import React, { FC, FormEvent, useContext, useState } from 'react';
import styles from './TornKeyForm.module.scss';
import AppContext from './AppContext';
import User from './interfaces/User';

interface Props {
    onAuthenticated(user: User): void,
}

const TornKeyForm: FC<Props> = ({ onAuthenticated }) => {
    const app = useContext(AppContext);

    const [tornKey, setTornKey] = useState('');
    const [checking, setChecking] = useState(false);
    const [lastCheckWasError, setLastCheckWasError] = useState(false);

    const submit = async (event: FormEvent) => {
        event.preventDefault();

        setChecking(true);
        setLastCheckWasError(false);

        const response = await fetch(app.serverBaseUrl + '/api/authenticate', {
            credentials: 'include',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({key: tornKey}),
        });

        setChecking(false);

        if (response.status === 200) {
            const { id, name } = await response.json();
            onAuthenticated({ id, name });
        } else {
            setLastCheckWasError(true);
        }
    }

    return (
        <form onSubmit={submit}>
            <h2>Authenticate</h2>
            <p>Enter your TORN API key:</p>
            <input className={lastCheckWasError ? styles.wrongKey : ''} type="text" value={tornKey} onChange={(event) => setTornKey(event.target.value)} disabled={checking}/>
            <input type="submit" disabled={checking} value="Unlock"/>
            {checking && <span>checking...</span>}
        </form>
    )
};

export default TornKeyForm;
