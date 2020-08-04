import React, { FC, useContext, useState } from 'react';
import Key from './interfaces/Key';
import styles from './ProxyKey.module.scss';
import AppContext from './AppContext';
import useConversion from './hooks/useConversion';

interface Props {
    keyEntity: Key
    useAltStyle: boolean
    onKeyRevoked(remainingKeys: Key[]): void
}

const ProxyKey: FC<Props> = ({ keyEntity: key, useAltStyle, onKeyRevoked }) => {
    const app = useContext(AppContext);
    const conversion = useConversion();

    const [revoking, setRevoking] = useState<boolean>(false);

    const revoke = async (event: React.MouseEvent) => {
        event.preventDefault();

        setRevoking(true);
        const response = await fetch(`${app.serverBaseUrl}/api/keys?key=${key.key}`, {
            method: 'delete',
            credentials: 'include'
        });
        const keys = (await response.json()).map(conversion.convertKeyRecordToEntity);
        onKeyRevoked(keys);
    };

    return (
        <>
            <tr className={styles.metaRow + ' ' + (useAltStyle ? styles.altRow : '')}>
                <td>{key.description}</td>
                <td><span title={key.createdAt.toString()}>{key.createdAt.toLocaleDateString()}</span></td>
                <td>
                    <button className={styles.revokeButton} onClick={revoke} disabled={revoking}>revoke</button>
                </td>
            </tr>
            <tr className={styles.keyRow + ' ' + (useAltStyle ? styles.altRow : '')}>
                <td colSpan={3}>
                    <span className={styles.key}>{key.key}</span>
                </td>
            </tr>
        </>
    )
};

export default ProxyKey;
