import React, { FC, useContext, useState } from 'react';
import Key from '../../interfaces/Key';
import styles from './ProxyKey.module.scss';
import AppContext from '../../AppContext';
import Button from '../../Button';
import useConversion from '../../hooks/useConversion';

interface Props {
    keyEntity: Key
    useAltStyle: boolean
    onKeyUpdated(allKeys: Key[]): void
}

const ProxyKey: FC<Props> = ({ keyEntity: key, useAltStyle, onKeyUpdated }) => {
    const app = useContext(AppContext);
    const conversion = useConversion();

    const [saving, setSaving] = useState<boolean>(false);

    async function revoke(event: React.MouseEvent) {
        event.preventDefault();
        const allKeys = await save({ revokedAt: new Date() });
        onKeyUpdated(allKeys);
    }

    async function reinstate(event: React.MouseEvent) {
        event.preventDefault();
        const allKeys = await save({ revokedAt: null });
        onKeyUpdated(allKeys);
    }

    async function save(props: Partial<Key>): Promise<Key[]> {
        const requestBody = {
            revoked_at: props.revokedAt?.toISOString() || null,
        };

        setSaving(true);
        const response = await fetch(`${app.serverBaseUrl}/api/keys/${key.key}`, {
            method: 'put',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(requestBody),
        });

        return (await response.json()).map(conversion.convertKeyRecordToEntity);
    }

    function renderPermissionsButton() {
        return <Button type="action" appearance="default" onClick={() => {}}>permissions</Button>;
    }

    const sharedRowStyles = [
        useAltStyle ? styles.altRow : '',
        key.revokedAt ? styles.revoked : '',
    ];

    return (
        <>
            <tr className={[...sharedRowStyles, styles.metaRow].join(' ')}>
                <td>{key.description}</td>
                <td><span title={key.createdAt.toString()}>{key.createdAt.toLocaleDateString()}</span></td>
                <td>
                    {key.revokedAt === null && (
                        <>
                            <Button type="action" appearance="danger" onClick={revoke} disabled={saving}>revoke</Button>
                            {renderPermissionsButton()}
                        </>
                    )}
                    {key.revokedAt !== null && (
                        <span title={key.revokedAt.toString()} className={styles.revokedAt}>revoked at {key.revokedAt.toLocaleDateString()}</span>
                    )}
                </td>
            </tr>
            <tr className={[...sharedRowStyles, styles.keyRow].join(' ')}>
                <td colSpan={key.revokedAt ? 2 : 3}>
                    <span className={styles.key + ' ' + (key.revokedAt !== null ? styles.revoked : '')}>{key.key}</span>
                </td>
                {key.revokedAt !== null && (
                    <td>
                        <Button type="action" appearance="default" onClick={reinstate} disabled={saving}>reinstate</Button>
                        {renderPermissionsButton()}
                    </td>
                )}
            </tr>
        </>
    )
};

export default ProxyKey;
