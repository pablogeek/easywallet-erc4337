
import { User } from '../../models/User'

export interface UserRepository {
    userByUsername(username: String): Promise<User>
    insert(username: string, password: string, salt: string): Promise<boolean>
}