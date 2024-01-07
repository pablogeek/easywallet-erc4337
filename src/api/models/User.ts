export class User {
    id: string;
    name: string;
    email: string;
    password: string;
    salt: string;
    
    constructor(id: string, name: string, email: string, passsword: string, salt: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = passsword;
        this.salt = salt;
    }
}