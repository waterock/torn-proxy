import Permissions from './permissions/Permissions';

export default interface KeyRecord {
    key: string
    user_id: number
    description: string
    permissions: Permissions | null
    created_at: string
    revoked_at: string | null
}
