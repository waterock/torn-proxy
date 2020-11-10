import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
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
    const [showRevokedKeys, setShowRevokedKeys] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [keysReloadedCount, setKeysReloadedCount] = useState<number>(0);

    useEffect(function loadKeys() {
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

    const activeKeys = useMemo(() => {
        return keys.filter((key) => key.revokedAt === null);
    }, [keys]);

    const revokedKeys = useMemo(() => {
        return keys.filter((key) => key.revokedAt !== null);
    }, [keys]);

    function lock(event: React.MouseEvent) {
        event.preventDefault();
        onLock();
    }

    function renderKeys(keys: Key[]) {
        return keys.map((key, i) => (
            <ProxyKey
                key={keysReloadedCount + '_' + key.key}
                keyEntity={key}
                useAltStyle={i % 2 !== 0}
                onKeyUpdated={keyUpdated}
            />
        ));
    }

    function keyUpdated(allKeys: Key[]) {
        // By updating the keysReloadedCount (used as part of loop key), we achieve a re-render of the ProxyKey children.
        // Without it, the `saving` state of the updated key would remain true, because somehow react applies an unwanted performance optimization despite reference UN-equality.
        setKeysReloadedCount(keysReloadedCount + 1);
        setKeys(allKeys);
    }

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
                {renderKeys(activeKeys)}
                </tbody>
                {revokedKeys.length > 0 && (
                    <tbody>
                    <tr>
                        <td colSpan={3}>
                            <label>
                                <input type="checkbox" checked={showRevokedKeys} onChange={(event) => setShowRevokedKeys(event.target.checked)}/>
                                &nbsp;Show revoked keys ({revokedKeys.length})
                            </label>
                        </td>
                    </tr>
                    {showRevokedKeys && renderKeys(revokedKeys)}
                    </tbody>
                )}
            </table>
            <div>
                <h3>New key? Nope!</h3>
                <p>It is no longer possible to create new keys. The <a href="https://www.torn.com/forums.php#/p=threads&f=63&t=16178384" target="_blank" rel="noopener">forum thread</a> explains why. Basically we're unable to guarantee service with the IP rate limit in place, and Ched isn't going to make any exceptions.</p>
                <p>I recommend reverting to the use of TORN keys.</p>
                <p>Existing keys will remain functional for a little while to ease the transition. But please switch back to TORN keys at your earliest convenience.</p>
            </div>
        </>
    )
};

export default ProxyKeys;
