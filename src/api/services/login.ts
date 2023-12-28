import { ethers } from "ethers";
import { Presets } from "userop";
import config from "../../../config.json";
import crypto from "crypto"
import { UserRepository } from "../repositories/users/UsersRepository";
import { UserRepositoryImpl } from "../repositories/users/UsersRepositoryImpl";
import db from "../database/database"

export class LoginService {
    saltSelected: string | undefined
    private userRepository: UserRepository

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    login = async (email: string, password: string) => {
        // config.signingKey
        const user = await this.userRepository.userByEmail(email);
        if (user === undefined) {
            throw "user doesn't exist";
        }
        
        const signingKey = '0x' + crypto.pbkdf2Sync(password, user!.salt, 10000, 32, "sha512").toString('hex');
        console.log(signingKey);
        console.log(config.signingKey);
        const simpleAccount = await Presets.Builder.SimpleAccount.init(
            new ethers.Wallet(signingKey),
            config.rpcUrl
          );
          const address = simpleAccount.getSender();
        return address
    }

    signup = async (email: string, password: string) => {
        const salt = this.generateSalt();
        const user = await this.userRepository.userByEmail(email);
        if (user !== undefined) {
            return false;
        }
        return this.userRepository.insert(email, password, salt);
    }

    private generateSalt = (): string => {
        const salt = crypto.randomBytes(16).toString('hex');
        return salt;
    }
}

export default new LoginService(new UserRepositoryImpl(db))