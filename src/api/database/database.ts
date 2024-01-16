import sqlite3 from 'sqlite3';

const DBSOURCE: string = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err: Error | null) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE, 
            password TEXT, 
            salt TEXT, 
            CONSTRAINT email_unique UNIQUE (email)
        )`,
        (err: Error | null) => {
            if (err) {
                // Table already created
            } else {
                // Table just created, creating some rows
                //let insert = 'INSERT INTO user (name, email, password) VALUES (?,?,?)';
                //db.run(insert, ["admin", "admin@example.com", md5("admin123456")]);
                //db.run(insert, ["user", "user@example.com", md5("user123456")]);
            }
        });  
    }
});

export default db;
