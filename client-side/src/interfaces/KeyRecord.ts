import PermissionString from '../PermissionString';

export default interface KeyRecord {
    key: string
    user_id: number
    permissions: PermissionString
    description: string
    created_at: string
    revoked_at: string | null
}
