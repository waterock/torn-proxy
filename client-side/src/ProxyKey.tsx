import React, { FC, useContext, useState } from 'react';
import Key from './interfaces/Key';
import styles from './ProxyKey.module.scss';
import AppContext from './AppContext';
import useConversion from './hooks/useConversion';

interface Props {
    keyEntity: Key
    useAltStyle: boolean
    onKeyRevoked(remainingKeys: Key[]): void
    onKeyReinstated(remainingKeys: Key[]): void
}

const ProxyKey: FC<Props> = ({ keyEntity: key, useAltStyle, onKeyRevoked, onKeyReinstated  }) => {
    const app = useContext(AppContext);
    const conversion = useConversion();

    const [revoking, setRevoking] = useState<boolean>(false);
    const [reinstating, setReinstating] = useState<boolean>(false);
    
    const revoke = async (event: React.MouseEvent) => {
        event.preventDefault();

        setRevoking(true);
        const response = await fetch(`${app.serverBaseUrl}/api/keys?key=${key.key}&revoked_at=${new Date().toString()}`, {
            method: 'patch',
            credentials: 'include'
        });
        const keys = (await response.json()).map(conversion.convertKeyRecordToEntity);
        onKeyRevoked(keys);
    }

    const reinstate = async (event: React.MouseEvent) => {
        event.preventDefault();

        setReinstating(true);
        const response = await fetch(`${app.serverBaseUrl}/api/keys?key=${key.key}&revoked_at=null`, {
            method: 'patch',
            credentials: 'include'
        });
        const keys = (await response.json()).map(conversion.convertKeyRecordToEntity);
        onKeyReinstated(keys);
    }

    return (
        <>
            <tr className={styles.metaRow + ' ' + (useAltStyle ? styles.altRow : '')}>
                <td>{key.description}</td>
                <td><span title={key.createdAt.toString()}>{key.createdAt.toLocaleDateString()}</span></td>
                <td>
                    {key.revokedAt !== null && (
                        <button className={styles.revokeButton} onClick={revoke} disabled={revoking}>revoke</button>
                    )}
                    {key.revokedAt === null && (
                        <button className={styles.reinstateButton} onClick={reinstate} disabled={reinstating}>reinstate</button>
                    )}
                </td>
            </tr>
            <tr className={styles.keyRow + ' ' + (useAltStyle ? styles.altRow : '')}>
                <td colSpan={3}>
                    <span className={styles.key + ' ' + (key.revokedAt !== null ? styles.revoked : '')}>{key.key}</span>
                </td>
            </tr>
        </>
    )
};

export default ProxyKey;
