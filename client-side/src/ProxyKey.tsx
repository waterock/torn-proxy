import React, { FC } from 'react';
import Key from './interfaces/Key';
import styles from './ProxyKey.module.scss';

interface Props {
    keyEntity: Key
    useAltStyle: boolean
}

const ProxyKey: FC<Props> = ({ keyEntity: key, useAltStyle }) => {
    return (
        <>
            <tr className={styles.metaRow + ' ' + (useAltStyle ? styles.altRow : '')}>
                <td>{key.description}</td>
                <td><span title={key.createdAt.toString()}>{key.createdAt.toLocaleDateString()}</span></td>
                <td>revoke</td>
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
