import { UserRepository } from "./UsersRepository";
import { Database, sqlite3 } from 'sqlite3'
import { User } from '../../models/User'

export class UserRepositoryImpl implements UserRepository {
    private db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    async userByUsername(username: String): Promise<User> {
        return new User("", "", "", "")
    }

    async insert(username: string, password: string, salt: string): Promise<boolean> {
        let insert = 'INSERT INTO user (name, email, password, salt) VALUES (?,?,?,?)';
        this.db.run(insert, ["admin", "admin@example.com", "admin123456", "salt"]);
        return true
    }
}