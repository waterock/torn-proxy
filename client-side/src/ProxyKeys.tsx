import React, { FormEvent, useContext, useEffect, useState } from 'react';
import ProxyKey from './ProxyKey';
import AppContext from './AppContext';
import styles from './ProxyKeys.module.scss';
import Key from './interfaces/Key';
import useConversion from './hooks/useConversion';

const ProxyKeys = () => {
    const app = useContext(AppContext);
    const conversion = useConversion();

    const [loading, setLoading] = useState(false);
    const [keys, setKeys] = useState<Key[]>([]);
    const [newKeyDescription, setNewKeyDescription] = useState<string>('');
    const [savingNewKey, setSavingNewKey] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        (async () => {
            const response = await fetch(app.serverBaseUrl + '/keys?user_id=' + app.user?.id);
            const keys: Key[] = (await response.json()).map(conversion.convertKeyRecordToEntity);

            setLoading(false);
            setKeys(keys);
        })();
    }, []);

    const createKey = async (event: FormEvent) => {
        event.preventDefault();

        // todo don't include user_id in post because easily fakeable -> use http only cookie with jwt token instead
        const postBody = {
            user_id: app.user?.id,
            description: newKeyDescription,
        };

        setSavingNewKey(true);
        const response = await fetch(app.serverBaseUrl + '/keys', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(postBody),
        })
        const keys = (await response.json()).map(conversion.convertKeyRecordToEntity);
        setKeys(keys);

        setNewKeyDescription('');
        setSavingNewKey(false);
    };

    if (loading) {
        return <span>Loading...</span>;
    }

    return (
        <>
            <table className={styles.root}>
                <thead>
                <tr>
                    <th>Key</th>
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
