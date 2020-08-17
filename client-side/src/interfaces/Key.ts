import Permissions from './permissions/Permissions';

export default interface Key {
    key: string
    userId: number
    description: string
    permissions: Permissions
    createdAt: Date
    revokedAt: Date | null
}
