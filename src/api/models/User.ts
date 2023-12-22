class User {
    id: string;
    name: string;
    email: string;
    salt: string;
    
    constructor(id: string, name: string, email: string, salt: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.salt = salt;
    }
}

module.exports = User;