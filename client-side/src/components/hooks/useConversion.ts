import Key from '../../interfaces/Key';
import KeyRecord from '../../interfaces/KeyRecord';

export default () => {
    return {
        convertKeyRecordToEntity(record: KeyRecord): Key {
            return {
                key: record.key,
                userId: record.user_id,
                description: record.description,
                permissions: record.permissions ? JSON.parse(record.permissions) : { torn: true },
                createdAt: new Date(record.created_at),
                revokedAt: record.revoked_at ? new Date(record.revoked_at) : null,
            };
        }
    }
}
