import PermissionString from '../PermissionString';

export default interface Key {
    key: string
    userId: number
    permissions: PermissionString
    description: string
    createdAt: Date
    revokedAt: Date | null
}
