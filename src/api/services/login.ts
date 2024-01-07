import { ethers } from "ethers";
import { Presets } from "userop";
import config from "../../../config.json";
import crypto from "crypto";
import { UserRepository } from "../repositories/users/UsersRepository";
import { UserRepositoryImpl } from "../repositories/users/UsersRepositoryImpl";
import db from "../database/database"
import { JwtRepository } from "../repositories/jwt/JwtRepository";
import { JwtRepositoryImpl } from "../repositories/jwt/JwtRepositoryImpl";
import { JwtPayLoad } from "../models/JwtPayload"

export class LoginService {
    private userRepository: UserRepository;
    private jwtRepository: JwtRepository;

    constructor(userRepository: UserRepository, jwtRepository: JwtRepository) {
        this.userRepository = userRepository;
        this.jwtRepository = jwtRepository;
    }

    login = async (email: string, password: string) => {
        const user = await this.userRepository.userByEmail(email);
        console.log('login ' + email);
        if (user === undefined) {
            throw "user doesn't exist";
        }
        const hashedPassword = this.hashPassword(password, user!.salt);
        if (user!.password != hashedPassword) {
            throw "wrong password";
        }
        const signingKey = '0x' + crypto.pbkdf2Sync(hashedPassword, user!.salt, 10000, 32, "sha512").toString('hex');
        console.log(signingKey);
        console.log(config.signingKey);
        const simpleAccount = await Presets.Builder.SimpleAccount.init(
            new ethers.Wallet(signingKey),
            config.rpcUrl
        );
        const address = simpleAccount.getSender();
        const payload: JwtPayLoad = {userId: user!.id}
        const key = this.jwtRepository.generateToken(payload)
        return { address: address, key: key }
    }

    signup = async (email: string, password: string) => {
        const salt = this.generateSalt();
        const hashedPassword = this.hashPassword(password, salt);
        const user = await this.userRepository.userByEmail(email);
        if (user !== undefined) {
            return false;
        }
        return this.userRepository.insert(email, hashedPassword, salt);
    }

    private generateSalt = (): string => {
        const salt = crypto.randomBytes(16).toString('hex');
        return salt;
    }

    private hashPassword = (password: string, salt: string): string => {
        return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex'); 
    };
}

export default new LoginService(new UserRepositoryImpl(db), new JwtRepositoryImpl())