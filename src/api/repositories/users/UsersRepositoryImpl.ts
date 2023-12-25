import { UserRepository } from "./UsersRepository";
import { Database, sqlite3 } from 'sqlite3'
import { User } from '../../models/User'

export class UserRepositoryImpl implements UserRepository {
    private db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    userByEmail(email: String): Promise<User | null> {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM user WHERE email = ? LIMIT 1';
            this.db.get(query, [email], (err, row: User | null) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });
    }

    async insert(email: string, password: string, salt: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let insert = 'INSERT INTO user (email, password, salt) VALUES (?,?,?)';
            this.db.run(insert, [email, password, salt], (err) => {
                console.log(err)
                resolve(err === null)
            });
        });
    }
}