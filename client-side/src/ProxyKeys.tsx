import React, { FC, useContext, useEffect, useState } from 'react';
import ProxyKey from './ProxyKey';
import AppContext from './AppContext';
import styles from './ProxyKeys.module.scss';
import Key from './interfaces/Key';
import useConversion from './hooks/useConversion';

interface Props {
    onLock(): void
}

const ProxyKeys: FC<Props> = ({ onLock }) => {
    const app = useContext(AppContext);
    const conversion = useConversion();

    const [loading, setLoading] = useState(false);
    const [keys, setKeys] = useState<Key[]>([]);
    const [newKeyDescription, setNewKeyDescription] = useState<string>('');
    const [savingNewKey, setSavingNewKey] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        (async () => {
            const response = await fetch(app.serverBaseUrl + '/api/keys', { credentials: 'include' });

            if (response.status === 200) {
                const keys: Key[] = (await response.json()).map(conversion.convertKeyRecordToEntity);
                setKeys(keys);
            } else {
                setErrorMessage((await response.json()).error_message || 'some error');
            }

            setLoading(false);
        })();
    }, []);

    const lock = (event: React.MouseEvent) => {
        event.preventDefault();
        onLock();
    };

    const createKey = async (event: React.FormEvent) => {
        event.preventDefault();

        setSavingNewKey(true);
        const response = await fetch(app.serverBaseUrl + '/api/keys', {
            credentials: 'include',
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ description: newKeyDescription }),
        })
        const keys = (await response.json()).map(conversion.convertKeyRecordToEntity);
        setKeys(keys);

        setNewKeyDescription('');
        setSavingNewKey(false);
    };

    if (errorMessage) {
        return <span>Error response from server: {errorMessage}. Please refresh the page.</span>;
    }

    if (loading) {
        return <span>Loading...</span>;
    }

    return (
        <>
            <p>Hello, {app.user?.name} [{app.user?.id}] <a href="#" className={styles.lockAnchor} onClick={lock}>Lock</a></p>
            <table className={styles.root}>
                <thead>
                <tr>
                    <th>Description</th>
                    <th>Created</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {keys.map((key, i) => (
                    <ProxyKey
                        key={key.key}
                        keyEntity={key}
                        useAltStyle={i % 2 !== 0}
                        onKeyRevoked={setKeys}
                    />
                ))}
                </tbody>
            </table>
            <div>
                <h3>New key</h3>
                <form action="" onSubmit={createKey}>
                    <input type="text" placeholder="Description" value={newKeyDescription} onChange={(event) => setNewKeyDescription(event.target.value)} disabled={savingNewKey}/>
                    <input type="submit" value="Create key" disabled={savingNewKey}/>
                    {savingNewKey && <span>creating key...</span>}
                </form>
            </div>
        </>
    )
};

export default ProxyKeys;
