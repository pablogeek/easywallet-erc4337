
import { User } from '../../models/User'

export interface UserRepository {
    userByEmail(email: String): Promise<User | null>
    insert(email: string, password: string, salt: string): Promise<boolean>
}